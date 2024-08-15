import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, signOut, db, doc, getDoc, setDoc } from "../lib/firebase";
import { getNotionTable } from "@/lib/notion";

export default function Home() {
  const [user] = useAuthState(auth);
  const [notionKey, setNotionKey] = useState("");
  const [hasKey, setHasKey] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notionData, setNotionData] = useState([]);

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
            fetchNotionData(user.email);
          }
        }
        setLoading(false);
      };
      checkNotionKey();
    } else {
      router.push("/");
    }
  }, [user, router]);

  const fetchNotionData = async (userEmail) => {
    try {
      const data = await getNotionTable(userEmail);
      setNotionData(data);
    }catch (error){
      console.error("error fetching Notion data", error);
    }
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const userDocRef = doc(db,"users", user.email);
    await setDoc(userDocRef,{notionApiKey:notionKey}, {merge:true});
    setHasKey(true);
    fetchNotionData(user.email);
  }

  const handleLogout = async () => {
    await signOut(auth);
    router.push("/");
  };

  if (loading) return <div> Loading .... </div>;

  return (
    <div>
      {hasKey ? (
        <div>
        <h1 className="text-2xl font-bold mb-4">Welcome to your Dashboard!</h1>
        {notionData.length === 0 ? (
          <div>No data found in your Notion database.</div>
        ) : (
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Title</th>
                <th className="py-2 px-4 border-b">Start Date</th>
                <th className="py-2 px-4 border-b">End Date</th>
                <th className="py-2 px-4 border-b">Total Time</th>
                <th className="py-2 px-4 border-b">Estimated Time</th>
                <th className="py-2 px-4 border-b">Status</th>
              </tr>
            </thead>
            <tbody>
              {notionData.map((item) => (
                <tr key={item.id}>
                  <td className="py-2 px-4 border-b">{item.title}</td>
                  <td className="py-2 px-4 border-b">{item.startDate}</td>
                  <td className="py-2 px-4 border-b">{item.endDate}</td>
                  <td className="py-2 px-4 border-b">{item.totalTime}</td>
                  <td className="py-2 px-4 border-b">{item.estimatedTime}</td>
                  <td className="py-2 px-4 border-b">{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <button onClick={handleLogout} className="mt-4">
          Logout
        </button>
      </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter your Notion API Key
          </label>
          <input
            type="text"
            value={notionKey}
            onChange={(e) => setNotionKey(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Notion API Key
        </button>
      </form>
      )}
    </div>
  );
}
