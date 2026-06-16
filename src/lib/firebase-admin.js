import admin from "firebase-admin";

if (!admin.apps.length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY 
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') 
    : undefined;

  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "qlupolla";

  if (privateKey && clientEmail) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("✔ Firebase Admin initialized via environment variables.");
  } else {
    // Check if serviceAccountKey.json is available in root
    try {
      const fs = require("fs");
      const path = require("path");
      const keyPath = path.join(process.cwd(), "serviceAccountKey.json");
      if (fs.existsSync(keyPath)) {
        const serviceAccount = JSON.parse(fs.readFileSync(keyPath, "utf8"));
        admin.initializeApp({
          credential: admin.credential.cert(serviceAccount),
        });
        console.log("✔ Firebase Admin initialized via local serviceAccountKey.json.");
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
        console.log("✔ Firebase Admin initialized via Application Default Credentials.");
      }
    } catch (err) {
      console.warn("⚠ Firebase Admin could not be initialized:", err.message);
    }
  }
}

export const adminDb = admin.apps.length ? admin.firestore() : null;
export const adminMessaging = admin.apps.length ? admin.messaging() : null;
export default admin;
