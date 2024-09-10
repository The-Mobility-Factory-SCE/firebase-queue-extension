import { database } from "firebase-functions/v1";
import {logger} from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp();
let listenTo = process.env.LISTEN_PATH || "/";


export const onWrite = database.ref(listenTo)
  .onWrite((change, context) => {
    //ignore root
    if(listenTo === "/") {
      return;
    }
    let queue = process.env.QUEUE || "firebaseTriggers";
    let writeType = change.before.exists() && change.after.exists() ? "update" : !change.after.exists() ? "delete" : "create";
    logger.info("onWrite", `${listenTo}/${change.after.key} ${writeType}`);
    
    admin.database().ref(queue).child(listenTo).push().set({"id": change.before.key, "timestamp": context.timestamp, "type": writeType});
  });