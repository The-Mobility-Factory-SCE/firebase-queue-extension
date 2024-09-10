import { expect } from "chai";
import { describe } from "mocha";
import * as admin from "firebase-admin";


admin.initializeApp();
const db = admin.database();


describe("order-changed", () => {
  it("id should be saved in queue", async () => {

    var pushId = db.ref("orders").push();
    await db.ref("orders").child(pushId.key!).set({"productId": "1234", "payment": "open"});
    await new Promise(f => setTimeout(f, 2000)); //wait for the function to finish
    let queue = await db.ref("firebaseTriggers").child("orders").orderByKey().limitToLast(1).get();
    let json = queue.toJSON();
    let entry = Object.values(json!)[0];
    expect(entry.id).equals(pushId.key);
   
  }).timeout(10000);
});
