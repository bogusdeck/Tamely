import Sidebar from "@/components/sidebar";
import { useAuth } from "../lib/useAuth";

export default function HomePage() {
  const { user } = useAuth();

  if (!user) {
    // Optionally show a loading state while checking auth
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Sidebar />
      <h1>Welcome, {user.displayName}!</h1>
      {/* Add your content here */}
    </div>
  );
}
