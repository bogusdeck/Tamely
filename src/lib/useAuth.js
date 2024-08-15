import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
        router.push("/");
      }
    });

    return () => unsubscribe();
  }, [router]);

  return { user };
};
