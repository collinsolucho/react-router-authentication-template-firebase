// ✅ CRITICAL: Ensure this is the SERVER/ADMIN SDK
import { adminAuth } from "../../.server/server";
import { commitSession, getSession } from "../../.server/session";

import { redirect } from "react-router";
import { updateUserByEmail } from "../../model/database";

export async function action({ request }) {
  const formData = await request.formData();
  const idToken = formData.get("idToken");

  // 1. VERIFY
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  console.log("log 1", decodedToken);
  // 2. DESTRUCTURE - Pull the specific fields out of the verified token
  const { uid, email, name, picture: avatar, email_verified } = decodedToken;

  // 3. MANUAL SYNC - Save to MongoDB
  const userData = { firebaseId: uid, name, avatar, email_verified };
  const result = await updateUserByEmail(email, userData);

  if (result.upsertedCount > 0) {
    console.log("New user created in MongoDB!");
  } else {
    console.log("Existing user updated in MongoDB.");
  }
  // 4. SESSION & REDIRECT
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", decodedToken.uid);
  console.log("log 2", decodedToken.uid);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
