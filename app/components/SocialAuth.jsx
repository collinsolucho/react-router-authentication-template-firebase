// app/components/SocialAuth.jsx
import { useFetcher } from "react-router";
import { signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaGithub } from "react-icons/fa";
import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
} from "../library/firebaseClient";

export function SocialAuth() {
  // Use fetcher to communicate with the /session action without a page reload
  const fetcher = useFetcher();

  // Check if the server is currently processing a login request
  const isSubmitting = fetcher.state !== "idle";

  const handleLogin = async (provider) => {
    try {
      // 1. Trigger the Firebase popup for the selected provider (Google/FB/GitHub)
      const result = await signInWithPopup(auth, provider);

      // 2. Retrieve the secure JWT (idToken) from the authenticated user
      const idToken = await result.user.getIdToken();

      // 3. POST the token to the /session action for server-side verification and MongoDB sync
      fetcher.submit({ idToken }, { method: "post", action: "/session" });
    } catch (error) {
      console.error("Auth error:", error);
    }
  };

  return (
    <div
      // Disable the buttons and dim the UI while a login is in progress
      className={`flex flex-col gap-3 mt-6 ${isSubmitting ? "opacity-50 pointer-events-none" : ""}`}
    >
      <p className="text-center text-gray-500 text-sm">Or continue with</p>

      <div className="flex flex-col gap-4">
        {/* Trigger handleLogin with the specific Firebase Provider on click */}
        <button
          onClick={() => handleLogin(googleProvider)}
          className="flex items-center justify-center gap-2 border p-3 rounded-lg hover:bg-gray-50 transition"
        >
          <FcGoogle className="text-2xl" /> Google
        </button>

        <button
          onClick={() => handleLogin(facebookProvider)}
          className="flex items-center justify-center gap-2 bg-[#1877F2] text-white p-3 rounded-lg hover:bg-blue-700 transition"
        >
          <FaFacebook className="text-2xl" /> Facebook
        </button>

        <button
          onClick={() => handleLogin(githubProvider)}
          className="flex items-center justify-center gap-2 bg-[#24292e] text-white p-3 rounded-lg hover:bg-gray-800 transition"
        >
          <FaGithub className="text-2xl" /> GitHub
        </button>
      </div>
    </div>
  );
}
