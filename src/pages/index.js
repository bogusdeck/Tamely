import { signInWithPopup, provider, auth } from "../lib/firebase";
import { useRouter } from "next/router";

export default function LandingPage() {
  const router = useRouter();

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User signed in :", result.user);
      router.push("/home");
    } catch (error) {
      console.error("error logging in:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="p-6 max-w-sm yellowbg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Welcome to Tamely</h2>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 blackbg yellowtxt hover:bg-blue-600"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
