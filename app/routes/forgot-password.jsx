import { useEffect } from "react";
import { useActionData, useNavigation, Form, redirect } from "react-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../library/firebaseClient";
import { toast } from "sonner"; // Direct import for client-side trigger
import { findUserByEmail } from "../../model/database";

import {
  getSession,
  commitSession,
  setSuccessMessage,
  setErrorMessage,
} from "../../.server/session";

export async function action({ request }) {
  const formData = await request.formData();
  const email = formData.get("email");
  const session = await getSession(request.headers.get("Cookie"));

  // 1. Check MongoDB
  const user = await findUserByEmail(email);

  if (user) {
    // 2. Success Path
    setSuccessMessage(
      session,
      "Reset link verified! Check your inbox shortly."
    );

    // We return this to the component so it can trigger the Firebase Email
    // But we must commit the session for the toast to work
    return Response.json(
      { success: true, email },
      { headers: { "Set-Cookie": await commitSession(session) } }
    );
  } else {
    // 3. Error Path - Redirect to signup with a Toast
    setErrorMessage(session, "Email not found. Create a new account below.");

    return redirect("/signup", {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  }
}

export default function ForgotPassword() {
  const actionData = useActionData();
  const navigation = useNavigation();
  const isSubmitting = navigation.state !== "idle";

  useEffect(() => {
    // If the server confirmed the user, trigger the Firebase email
    if (actionData?.success && actionData?.email) {
      sendPasswordResetEmail(auth, actionData.email)
        .then(() => {
          // Note: The "Success" toast from the server will show via Root.jsx
          // because we committed it to the session in the action!
        })
        .catch((error) => {
          toast.error("Firebase Error: " + error.message);
        });
    }
  }, [actionData]);

  return (
    <main className="max-w-2xl mx-auto p-20">
      <h1 className="text-3xl font-bold uppercase">Reset Password</h1>
      <p className="mt-4 text-gray-600">
        Enter your email to verify your account.
      </p>

      <Form method="post" className="flex flex-col gap-5 mt-6">
        <input
          type="email"
          name="email"
          required
          placeholder="example@email.com"
          className="border-2 p-3 rounded-xl focus:border-black outline-none transition"
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-black text-white p-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:bg-gray-400"
        >
          {isSubmitting ? "VERIFYING..." : "SEND RESET LINK"}
        </button>
      </Form>
    </main>
  );
}
