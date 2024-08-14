import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signOut, db, doc, getDoc, setDoc } from "../lib/firebase";
import NotionKeyForm from "@/components/NotionKeyForm";

export default function Home() {
  const [user] = useAuthState(auth);
  const [notionKey, setNotionKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  useEffect(() => {
    if (user) {
      const checkNotionKey = async () => {
        const userDocRef = doc(db, "users", user.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.notionApiKey) {
            setHasKey(true);
          }
        }
        setLoading(false);
      };
      checkNotionKey();
    } else {
      router.push("/");
    }
  }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userDocRef = doc(db, "users", user.email);
    await setDoc(userDocRef, { notionApiKey: notionKey }, { merge: true });
    setHasKey(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <div> Loading .... </div>;

  return (
    <div>
      {hasKey ? (
        <div> {/* Dashboard Component */} Welcome to your Dashboard!</div>
      ) : (
        <NotionKeyForm />
      )}
    </div>
  );
}
