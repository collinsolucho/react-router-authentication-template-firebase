# 🛡️ Hybrid Auth Portal (React Router + Firebase + MongoDB)

A high-performance, secure authentication system using the **Hybrid Model**. This project decouples identity management (Firebase) from application data (MongoDB) to ensure maximum security and zero password liability.

## 🚀 The Architecture

This project uses a **Division of Labor** strategy:

- **Firebase:** Acts as the "Security Guard" (Identity, Auth, Password Resets).
- **MongoDB:** Acts as the "Librarian" (User Profiles, Roles, Business Logic).
- **React Router:** Acts as the "Traffic Controller" (Server-side sessions and Role-based routing).

## 🛠️ Tech Stack

- **Framework:** React Router v7
- **Auth (Client/Admin):** Firebase SDK & Firebase Admin SDK
- **Database:** MongoDB Atlas
- **Styling:** Tailwind CSS

## ⚙️ Environment Variables

Create a `.env` file in the root directory and add the following:

```env
# Firebase Client (Public)
VITE_FIREBASE_API_KEY="your-api-key"
VITE_FIREBASE_AUTH_DOMAIN="your-app.firebaseapp.com"
VITE_FIREBASE_PROJECT_ID="your-project-id"

# Firebase Admin (Secret - Server Side Only)
FIREBASE_SERVICE_ACCOUNT='{"type": "service_account", "project_id": "...", "private_key": "..."}'

# MongoDB
MONGODB_URL="mongodb+srv://..."
```
