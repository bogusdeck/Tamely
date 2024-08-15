import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth, db, doc, setDoc } from "../lib/firebase";

export default function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const sidebarRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsSidebarVisible(false);
      }
    };

    const handleMouseMove = (event) => {
      if (event.clientX < 50) {
        setIsSidebarVisible(true);
      }
    };

    document.addEventListener("click", handleClickOutside);
    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      document.removeEventListener("click", handleClickOutside);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <div>
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gray-800 text-white transform ${
          isSidebarVisible ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out w-64`}
      >
        <div className="p-4">
          <h2 className="text-xl font-semibold">Sidebar</h2>
          <ul>
            <li className="mt-4">
              <a href="#" className="hover:underline">
                DASH
              </a>
            </li>
            <li className="mt-4">
              <a href="#" className="hover:underline">
                Timer
              </a>
            </li>
            <li className="mt-4">
              <a href="#" className="hover:underline">
                Aesthetic Clock
              </a>
            </li>
            <li className="mt-4">
              <a href="#" className="hover:underline">
                Project Log
              </a>
            </li>
            <li className="mt-4">
              <a href="#" className="hover:underline">
                Buy Me a Coffee
              </a>
            </li>
          </ul>
        </div>
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button
            onClick={handleLogout}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
