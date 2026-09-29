import {
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { GetFireBaseConfig } from "../config/firebase.config";

export type GoogleUserData = {
  email: string | null;
  name: string | null;
  photoURL: string | null;
  token: string;
  refreshToken?: string;
};

export const GoogleResponse = () => {
  const { auth, provider } = GetFireBaseConfig({
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
  });

  provider.setCustomParameters({
    prompt: "select_account",
  });

  const logout = async () => {
    await signOut(auth);
  };

  const getSignInWithPopup = async (): Promise<GoogleUserData> => {
    const res = await signInWithPopup(auth, provider);
    const token = await res.user.getIdToken();

    return {
      email: res.user.email,
      name: res.user.displayName,
      photoURL: res.user.photoURL,
      token,
      refreshToken: (res.user as any).refreshToken,
    };
  };

  return { getSignInWithPopup, logout };
};
