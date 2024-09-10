import { database } from "firebase-functions/v1";
import {logger} from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp();
let path = process.env.LISTEN_PATH || "/";


export const onWrite = database.ref(path)
  .onWrite((change, context) => {
    //ignore root
    if(path === "/") {
      return;
    }
    logger.info("onWrite", `${path}/${change.after.key} changed`);
    let queue = process.env.QUEUE || "firebaseTriggers";
    let writeType = change.before.exists() && change.after.exists() ? "update" : !change.after.exists() ? "delete" : "create";
    
    admin.database().ref(queue).child(path).push().set({"id": change.before.key, "timestamp": context.timestamp, "type": writeType});
  });