import { Form, Link, useFetcher } from "react-router";
import { SocialAuth } from "../components/SocialAuth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../library/firebaseClient";
import { toast } from "sonner";

export function meta() {
  return [
    { title: "React Router Reset Password Template" },
    { name: "description", content: "Welcome to React Router Reset Password!" },
  ];
}

export default function Home() {
  const fetcher = useFetcher();
  const handleLogin = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      // 1. Firebase checks the password (Security Guard)
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      // 2. Pass the token to the server to check roles in MongoDB
      fetcher.submit({ idToken }, { method: "post", action: "/session" });
    } catch (error) {
      toast.error("Invalid email or password");
    }
  };
  return (
    <main className="max-w-6xl mx-auto p-20">
      <h1 className="text-3xl font-bold">
        RESET YOUR PASSWORD & SOCIAL LOGINS
      </h1>
      <Form onSubmit={handleLogin} className="flex flex-col gap-5 mt-6">
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

        {/* LOGIN BUTTON */}
        <button
          type="submit"
          disabled={fetcher.state !== "idle"}
          className="bg-black text-white p-3 rounded font-bold"
        >
          {fetcher.state !== "idle" ? "LOGGING IN..." : "LOGIN"}
        </button>

        {/* FORGOT PASSWORD */}
        <section className="flex gap-2 mt-4">
          <p>Forgot password?</p>

          <Link
            to="/forgot-password"
            className="text-blue-500 hover:text-blue-800 font-bold"
          >
            Click Here
          </Link>
        </section>
        {/* SOCIAL LOGIN */}
      </Form>
      <p>Dont Have An Account?</p>
      <Link to="/signup" className="w-6 h-6 text-blue-600">
        create account
      </Link>
      <SocialAuth /> {/* 👈 Shared Buttons */}
    </main>
  );
}
