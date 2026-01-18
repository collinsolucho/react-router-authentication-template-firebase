import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("signup", "routes/signup.jsx"),
  route("session", "routes/session.jsx"),
];
