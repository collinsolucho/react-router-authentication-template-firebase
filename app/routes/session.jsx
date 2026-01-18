// ✅ CRITICAL: Ensure this is the SERVER/ADMIN SDK
import { adminAuth } from "../../.server/server";
import { commitSession, getSession } from "../../.server/session";

import { redirect } from "react-router";

export async function action({ request }) {
  const formData = await request.formData();
  const idToken = formData.get("idToken");

  // 1. VERIFY
  const decodedToken = await adminAuth.verifyIdToken(idToken);
  console.log("log 1", decodedToken);
  // // 2. EXTRACT & 3. SYNC TO MONGO
  // const db = client.db("passwordAuthentication");
  // await db.collection("logins").updateOne(
  //   { firebaseId: decodedToken.uid },
  //   {
  //     $set: {
  //       email: decodedToken.email,
  //       name: decodedToken.name,
  //       lastLogin: new Date(),
  //     },
  //   },
  //   { upsert: true }
  // );

  // 4. SESSION & REDIRECT
  const session = await getSession(request.headers.get("Cookie"));
  session.set("userId", decodedToken.uid);
  console.log("log 2", decodedToken.uid);
  return redirect("/", {
    headers: { "Set-Cookie": await commitSession(session) },
  });
}
