import { useRouter } from 'next/router';
import Sidebar from "../components/sidebar";
import Clock from "../components/Clock";
import { useAuth } from "../lib/useAuth";

const ClockPage = () => {
  const router = useRouter();
  const { user } = useAuth();

  // Load allowed emails from the environment variable
  const allowedEmails = process.env.NEXT_PUBLIC_ALLOWED_EMAILS
    ? process.env.NEXT_PUBLIC_ALLOWED_EMAILS.split(",")
    : []

  const handleNavigationToDashboard = () => {
    router.push({
      pathname: '/dashhoard',  
      query: { fromClock: 'true' },
    });
  };

  const isEmailAllowed = user && allowedEmails.includes(user.email);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1">
        <Clock />
        
        {isEmailAllowed && (
          <button onClick={handleNavigationToDashboard}>
            143
          </button>
        )}
      </div>
    </div>
  );
};

export default ClockPage;
