import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

export type FirebaseConfig = {
  apiKey: string;
  authDomain: string;
  projectId?: string;
  appId?: string;
};

export const GetFireBaseConfig = (firebaseConfig: FirebaseConfig) => {
  // avoid re-init on Vite hot reload
  const firebaseApp = getApps().length ? getApp() : initializeApp(firebaseConfig);

  const auth = getAuth(firebaseApp);
  const provider = new GoogleAuthProvider();

  provider.addScope("profile");
  provider.addScope("email");

  return { auth, provider };
};
