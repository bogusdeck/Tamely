import { useState, useEffect, useRef } from "react";
import { signOut } from "firebase/auth";
import { auth, db, doc, setDoc } from "../lib/firebase";
import Modal from "./modal";

export default function Sidebar() {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const sidebarRef = useRef(null);

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
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  const handleSaveNotionKey = async (notionKey) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const userDocRef = doc(db, "users", user.email);
        await setDoc(userDocRef, { notionApiKey: notionKey }, { merge: true });
        console.log("Notion API Key updated successfully!");
      } catch (error) {
        console.error("Error updating Notion API Key: ", error);
      }
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
              <a
                href="#"
                className="hover:underline"
                onClick={() => setIsModalOpen(true)}
              >
                Update Notion Key
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

      {/* Modal Component */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        handleSubmit={handleSaveNotionKey}
      />
    </div>
  );
}
