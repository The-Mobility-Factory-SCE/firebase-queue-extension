import * as functions from "firebase-functions";
import * as admin from "firebase-admin";


admin.initializeApp();
let listenTo = process.env.LISTEN_PATH || "/";


export const onWrite = functions.database.ref(listenTo)
  .onWrite((change, context) => {
    //ignore root
    if(listenTo === "/") {
      return;
    }
    let queue = process.env.QUEUE || "firebaseQueue";
    let writeType = change.before.exists() && change.after.exists() ? "update" : !change.after.exists() ? "delete" : "create";
    functions.logger.info("onWrite", `${listenTo}/${change.after.key} ${writeType}`);
    
    return change.after.ref.root.child(queue).child(listenTo).push({"id": change.before.key, "timestamp": context.timestamp, "type": writeType});
  });