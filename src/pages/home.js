import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signOut, db, doc, getDoc, setDoc } from "../lib/firebase";
import Dashboard from "../components/Dashboard";
import NotionKeyForm from "../components/NotionKeyForm";

export default function Home() {
  const [user, loading] = useAuthState(auth);
  const [hasKey, setHasKey] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/"); // Redirect to login if not authenticated
    } else {
      const checkNotionKey = async () => {
        const userDocRef = doc(db, "users", user.email);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          if (userData.notionApiKey) {
            setHasKey(true);
          }
        }
      };
      checkNotionKey();
    }
  }, [user, loading, router]);

  const handleSubmit = async (notionKey) => {
    if (user) {
      const userDocRef = doc(db, "users", user.email);
      await setDoc(userDocRef, { notionApiKey: notionKey }, { merge: true });
      setHasKey(true);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <div>Loading ....</div>;

  return (
    <div>
      {hasKey ? (
        <Dashboard onLogout={handleLogout} />
      ) : (
        <NotionKeyForm onSubmit={handleSubmit} />
      )}
    </div>
  );
}
