import { client } from "../.server/mongo";

let db = client.db("passwordAuthentication");
let logins = db.collection("logins");

export async function updateUserByEmail(email, userData) {
  return await logins.updateOne(
    { email: email }, // Filter: find user by email
    {
      $set: {
        ...userData,
        lastLogin: new Date(),
      },
    },
    { upsert: true } // 👈 This is the "Magic" for manual add
  );
}
