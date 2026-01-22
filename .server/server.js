import admin from "firebase-admin";

// Check if Firebase Admin is already initialized to prevent "duplicate app" errors
if (!admin.apps.length) {
  admin.initializeApp({
    // Authenticate using the Master Key stored in the Environment Variables
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

// Export the Auth service to verify ID Tokens and manage users on the server
export const adminAuth = admin.auth();
