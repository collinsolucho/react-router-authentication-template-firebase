# 🛠️ Technical Specifications: Hybrid Auth Portal

## 1. Authentication Logic (The Hybrid Flow)

This project implements a decoupled authentication strategy to ensure security and scalability.

### Registration Flow

1. **Client:** `createUserWithEmailAndPassword` (Firebase SDK).
2. **Token:** Retrieve `idToken` from the UserCredential.
3. **Handshake:** POST `idToken` to `/session` action.
4. **Validation:** Server verifies token via `adminAuth.verifyIdToken`.
5. **Persistence:** `syncUserProfile` upserts data into MongoDB based on **Email** as the unique key.

### Login Flow

1. **Client:** `signInWithEmailAndPassword` or `signInWithPopup` (Social).
2. **Bridge:** Token is sent to `/session`.
3. **Routing:** Server fetches `role` from MongoDB and redirects to specific sub-routes.

---

## 2. Database Schema (MongoDB: `logins` collection)

| Field        | Type     | Description                                         |
| :----------- | :------- | :-------------------------------------------------- |
| `_id`        | ObjectId | MongoDB Primary Key                                 |
| `email`      | String   | **Unique Identifier** (Primary index)               |
| `firebaseId` | String   | The UID provided by Firebase (The "Anchor")         |
| `name`       | String   | User display name                                   |
| `avatar`     | String   | URL to profile image (from Google or manual upload) |
| `role`       | String   | Enum: `teacher`, `parent`, or `null`                |
| `createdAt`  | Date     | Timestamp of account creation                       |
| `lastLogin`  | Date     | Updated every time `/session` is hit                |

---

## 3. Route Permissions & Access Control

| Route         | Allowed Roles | Guard Method                             |
| :------------ | :------------ | :--------------------------------------- |
| `/`           | Public        | None                                     |
| `/signup`     | Public        | None                                     |
| `/teacher/*`  | `teacher`     | Server-side Loader checks `session.role` |
| `/parent/*`   | `parent`      | Server-side Loader checks `session.role` |
| `/onboarding` | Authenticated | Redirects here if `role == null`         |

---

## 4. UI/UX Rules

- **Loading States:** All auth buttons must use `fetcher.state !== "idle"` to show a spinner and disable clicks.
- **Error Handling:** Use `sonner` toasts for Firebase client errors and `actionData` for server-side validation.
- **Password Security:** The UI must enforce 8+ characters, uppercase, and special symbols before allowing a Firebase call.

---

## 5. Account Linking Policy

- **Primary Key:** `email` is the source of truth.
- **Strategy:** If a user logs in with a different provider (Google vs Email) using the same email address, the accounts are merged in MongoDB by updating the `firebaseId` on the existing email document.
