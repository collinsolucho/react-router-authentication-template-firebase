import { Form, useFetcher } from "react-router";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../library/firebaseClient";

export default function Home() {
  const fetcher = useFetcher();

  const handleSocialLogin = async (provider) => {
    try {
      // 1. Trigger the Firebase Popup
      const result = await signInWithPopup(auth, provider);

      // 2. Get the secure ID Token (JWT)
      const idToken = await result.user.getIdToken();
      console.log(idToken);
      // 3. Submit to your React Router action
      fetcher.submit(
        { idToken, intent: "social-auth" },
        { method: "post", action: "/session" }
      );
    } catch (error) {
      console.error("Authentication failed:", error.code);
    }
  };

  return (
    <main className="max-w-6xl mx-auto p-20">
      <h1 className="text-3xl font-bold">CREATE ACCOUNT</h1>

      {/* Standard Email/Password Form */}
      <Form method="post" className="flex flex-col gap-5 mt-6">
        {/* ... your email/password inputs remain the same ... */}
        {/* EMAIL */}

        <div className="flex flex-col">
          <label htmlFor="email" className="font-bold text-xl">
            Email Address
          </label>

          <span className="text-sm text-red-500 italic">
            Please enter a valid email
          </span>

          <input
            type="email"
            name="email"
            id="email"
            required
            className="border-2 p-2 mt-2"
            placeholder="example@email.com"
          />
        </div>

        {/* PASSWORD */}

        <div className="flex flex-col">
          <label htmlFor="password" className="font-bold text-xl">
            Password
          </label>

          <span className="text-sm text-red-400 italic">
            Minimum 8 characters
          </span>

          <input
            type="password"
            name="password"
            id="password"
            required
            className="border-2 p-2 mt-2"
            placeholder="Enter password"
          />
        </div>

        <button
          type="submit"
          className="border-2 p-2 rounded-lg font-bold hover:bg-black hover:text-white transition"
        >
          CREATE ACCOUNT
        </button>
      </Form>

      {/* Updated Social Login Section */}
      <div className="mt-6 flex gap-6">
        <button
          onClick={() => handleSocialLogin(googleProvider)}
          className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100 transition cursor-pointer"
        >
          <FcGoogle className="w-6 h-6" /> Google
        </button>

        <button
          onClick={() => handleSocialLogin(facebookProvider)}
          className="flex items-center gap-2 border p-2 rounded hover:bg-gray-100 transition cursor-pointer"
        >
          <FaFacebook className="w-6 h-6 text-blue-600" /> Facebook
        </button>
      </div>
    </main>
  );
}
