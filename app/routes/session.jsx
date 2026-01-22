// ✅ Corrected Session Action
import { adminAuth } from "../../.server/server";
import {
  commitSession,
  getSession,
  setSuccessMessage,
} from "../../.server/session";
import { redirect } from "react-router";
import { syncUserProfile } from "../../model/database"; // Use the sync helper

export async function action({ request }) {
  const formData = await request.formData();
  const idToken = formData.get("idToken");

  try {
    // 1. VERIFY - Firebase Admin SDK checks if the token is legit
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    console.log(decodedToken);
    const { uid, email, name, picture: avatar } = decodedToken;

    // 2. SYNC - Save profile to MongoDB (No passwords!)
    await syncUserProfile(uid, email, {
      name: name || email.split("@")[0],
      avatar,
    });

    // 3. SESSION
    const session = await getSession(request.headers.get("Cookie"));
    session.set("userId", uid);
    setSuccessMessage(session, "Welcome to the app!");

    // //  Fetch the full user from MongoDB to check their ROLE
    // const dbUser = await findUserByFirebaseId(uid);
    // if role-based routing done here eg
    // if (dbUser?.role === "parent") {
    //   return redirect("/parent/portal", {
    //     headers: { "Set-Cookie": await commitSession(session) },
    //   });
    // }
    // // Default redirect if no role is set yet
    // return redirect("/onboarding", {
    //   headers: { "Set-Cookie": await commitSession(session) },
    // });

    return redirect("/signup", {
      headers: { "Set-Cookie": await commitSession(session) },
    });
  } catch (error) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
}
