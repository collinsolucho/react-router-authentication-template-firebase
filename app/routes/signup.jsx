import { useFetcher, Form } from "react-router";
import { createUserWithEmailAndPassword } from "firebase/auth"; // Import this!
import { auth } from "../library/firebaseClient"; // Import your client auth
import { SocialAuth } from "../components/SocialAuth";
import { validateUser } from "../functions/function";
// moved function.js from .server since its used in client side
import { toast } from "sonner";

export default function Signup() {
  const fetcher = useFetcher();

  // These errors now come from local validation or fetcher.data
  const emailError = fetcher.data?.errors?.email;
  const passwordError = fetcher.data?.errors?.password;

  const handleEmailSignup = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");
    console.log(password);
    console.log(email);
    // 1. Client-side Validate
    const errors = validateUser(email, password);
    if (errors) {
      toast.error("Please fix form errors");
      return;
    }

    try {
      // 2. The Firebase "Birth"
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      // 3. The Registration Bridge (Send to your /session route)
      fetcher.submit({ idToken }, { method: "post", action: "/session" });
    } catch (error) {
      toast.error(error.message); // e.g., "Email already in use"
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-20">
      <h1 className="text-3xl font-bold uppercase">Create Account</h1>

      {/* 🟢 Switch from method="post" to onSubmit */}
      <Form onSubmit={handleEmailSignup} className="flex flex-col gap-5 mt-6">
        <div className="flex flex-col">
          <label className="font-bold">Email Address</label>
          {emailError && <span className="text-red-500">{emailError}</span>}
          <input type="email" name="email" required className="border-2 p-2" />
        </div>

        <div className="flex flex-col">
          <label className="font-bold">Password</label>
          {passwordError && (
            <span className="text-red-500">{passwordError}</span>
          )}
          <input
            type="password"
            name="password"
            required
            className="border-2 p-2"
          />
        </div>

        <button
          type="submit"
          disabled={fetcher.state !== "idle"}
          className="bg-black text-white p-3 rounded font-bold transition disabled:bg-gray-400"
        >
          {fetcher.state !== "idle" ? "CREATING..." : "CREATE ACCOUNT"}
        </button>
      </Form>

      <SocialAuth />
    </main>
  );
}
