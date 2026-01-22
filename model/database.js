import { client } from "../.server/mongo";

const db = client.db("passwordAuthentication");
const logins = db.collection("logins");

// 1. Used for both Social & Traditional after Firebase confirms the user
// model/database.js

export async function syncUserProfile(firebaseUid, email, extraData = {}) {
  return await logins.updateOne(
    { email: email }, // 👈 SEARCH BY EMAIL, not firebaseId
    {
      $set: {
        firebaseId: firebaseUid, // 👈 This "links" the new ID to the existing email
        email,
        ...extraData,
        lastLogin: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(),
        role: "user",
      },
    },
    { upsert: true }
  );
}

// 2. Used to check if we should even show the "Forgot Password" UI
export async function findUserByEmail(email) {
  const user = await logins.findOne({ email });
  return user; // Returns the user object OR null if not found
}

// model/database.js
export async function findUserByFirebaseId(uid) {
  return await logins.findOne({ firebaseId: uid });
}

// 3. Optional: Track reset requests for security audits
export async function logPasswordResetRequest(email) {
  return await logins.updateOne(
    { email },
    { $set: { lastPasswordResetRequested: new Date() } }
  );
}
