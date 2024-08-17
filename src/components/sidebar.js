import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import DroppedTasksModal from "./DroppedTasksModal";
import { useAuth } from "../lib/useAuth";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

export default function Sidebar({ onProjectLogClick }) {
  const [isSidebarVisible, setIsSidebarVisible] = useState(false);
  const [isDroppedTasksModalVisible, setIsDroppedTasksModalVisible] =
    useState(false);
  const sidebarRef = useRef(null);
  const router = useRouter();
  const { user } = useAuth();
  const userEmail = user?.email;

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

  const handleClearData = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to clear all tasks data? This action cannot be undone.",
    );
    if (isConfirmed && userEmail) {
      await clearUserData(userEmail);
    }
  };

  const clearUserData = async (email) => {
    try {
      if (!email) throw new Error("No user email provided");

      const userCollection = collection(db, email);
      const querySnapshot = await getDocs(userCollection);

      const initialDocumentId = "initialDocument"; // Replace with the actual ID or name of the initial document

      const deletePromises = querySnapshot.docs
        .filter((doc) => doc.id !== initialDocumentId)
        .map((doc) => deleteDoc(doc.ref));

      await Promise.all(deletePromises);
      console.log("All user data cleared except initial document");
    } catch (error) {
      console.error("Error clearing user data: ", error);
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
              <button
                onClick={() => router.push("/home")}
                className="hover:underline"
              >
                DASH
              </button>
            </li>
            <li className="mt-4">
              <button onClick={onProjectLogClick} className="hover:underline">
                Project Log
              </button>
            </li>
            <li className="mt-4">
              <button
                onClick={() => setIsDroppedTasksModalVisible(true)}
                className="hover:underline"
              >
                Dropped Tasks
              </button>
            </li>
            <li className="mt-4">
              <button
                onClick={handleClearData}
                className="hover:underline text-red-500"
              >
                Clear All Tasks
              </button>
            </li>
            <li className="mt-4">
              <a
                href="https://bogusdeck.github.app"
                className="hover:underline"
              >
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

      {/* Dropped Tasks Modal */}
      {isDroppedTasksModalVisible && (
        <DroppedTasksModal
          userEmail={userEmail}
          isOpen={isDroppedTasksModalVisible}
          onClose={() => setIsDroppedTasksModalVisible(false)}
        />
      )}
    </div>
  );
}
