import { Form, Link } from "react-router";

export function meta() {
  return [
    { title: "React Router Reset Password Template" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <main className="max-w-6xl mx-auto p-20">
      <h1 className="text-3xl font-bold">
        RESET YOUR PASSWORD & SOCIAL LOGINS
      </h1>

      <Form method="post" className="flex flex-col gap-5 mt-6">
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
          className="border-2 p-2 rounded-lg font-bold hover:bg-black hover:text-white transition"
        >
          Login
        </button>

        {/* SOCIAL LOGIN */}
        <section className="mt-2">
          <p className="text-xl font-bold">Or login with</p>
        </section>

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
      </Form>
      <Link to="/signup" className="w-6 h-6 text-blue-600">
        create account
      </Link>
    </main>
  );
}
