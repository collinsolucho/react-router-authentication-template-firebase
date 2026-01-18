// app/routes/auth.$.jsx
import { Auth } from "@auth/core";
import { authConfig } from "../../.server/server";

export async function loader({ request }) {
  return await Auth(request, authConfig);
}

export async function action({ request }) {
  // We pass the request directly.
  // Auth.js will handle setting the CSRF cookie and redirecting.
  return await Auth(request, authConfig);
}
