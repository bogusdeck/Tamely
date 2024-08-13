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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="p-6 max-w-sm bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Welcome</h2>
        <button
          onClick={handleLogin}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Login with Google
        </button>
      </div>
    </div>
  );
}
