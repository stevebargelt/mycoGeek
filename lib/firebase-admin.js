import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
  privateKey: process.env.PRIVATE_KEY,
  clientEmail: process.env.CLIENT_EMAIL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
};

export function customInitApp() {
  if (getApps().length <= 0) {
    initializeApp(firebaseAdminConfig);
  }
}
