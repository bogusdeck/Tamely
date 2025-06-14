import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "firebase/auth";
import { auth } from "../lib/firebase";
import DroppedTasksModal from "./DroppedTasksModal";
import { useAuth } from "../lib/useAuth";
import { collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FiBarChart2, FiFileText, FiTrash2, FiBroom, FiMenu, FiX, FiLogOut } from "react-icons/fi";

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

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: FiBarChart2 },
    { id: "projectLog", label: "Project Log", icon: FiFileText },
    { id: "droppedTasks", label: "Dropped Tasks", icon: FiTrash2 },
    { id: "clearData", label: "Clear All Tasks", icon: FiBroom, danger: true },
  ];

  useEffect(() => {
    if (isSidebarVisible) {
      const menuElements = document.querySelectorAll('.menu-item');
      menuElements.forEach((item, index) => {
        setTimeout(() => {
          item.classList.add('animate-slide-in');
          item.style.opacity = 1;
        }, 100 + (index * 70));
      });
    }
  }, [isSidebarVisible]);

  return (
    <div>
      {/* Sidebar toggle button for mobile */}
      <button
        onClick={() => setIsSidebarVisible(!isSidebarVisible)}
        className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-md bg-dark-tertiary text-dark-text shadow-dark-lg hover:shadow-glow transition-all duration-200 transform hover:scale-110"
      >
        {isSidebarVisible ? <FiX /> : <FiMenu />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarVisible && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 md:hidden animate-fade-in"
          onClick={() => setIsSidebarVisible(false)}
        ></div>
      )}
      
      <div
        ref={sidebarRef}
        className={`fixed top-0 left-0 h-full bg-gradient-to-b from-dark-secondary to-dark-tertiary text-dark-text border-r border-dark-border transform ${isSidebarVisible ? "translate-x-0" : "-translate-x-full"} transition-all duration-300 ease-in-out w-64 shadow-dark-lg z-50`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center">
              <img src="/icon.png" alt="Tamely Logo" className="h-10 w-10 mr-2" />
              <h2 className="text-2xl font-bold bg-gradient-to-r from-dark-accent to-dark-accentHover bg-clip-text text-transparent animate-pulse-subtle">Tamely</h2>
            </div>
            <div className="md:hidden">
              <button 
                onClick={() => setIsSidebarVisible(false)}
                className="p-2 rounded-full bg-dark-hover hover:bg-dark-border transition-colors duration-200"
              >
                <FiX />
              </button>
            </div>
          </div>
          
          <nav>
            <ul className="space-y-3">
              {menuItems.map((item, index) => (
                <li key={item.id} className="menu-item" style={{ opacity: 0 }}>
                  <button
                    onClick={() => {
                      if (item.id === "projectLog") {
                        onProjectLogClick();
                      } else if (item.id === "droppedTasks") {
                        setIsDroppedTasksModalVisible(true);
                      } else if (item.id === "dashboard") {
                        router.push("/home");
                      } else if (item.id === "clearData") {
                        handleClearData();
                      }
                      if (window.innerWidth < 768) setIsSidebarVisible(false);
                    }}
                    className={`sidebar-item ${item.danger ? "hover:bg-red-800 hover:text-white" : ""} ${router.pathname === "/home" && item.id === "dashboard" ? "bg-dark-hover text-dark-accent shadow-glow" : ""}`}
                  >
                    <span className="mr-3 text-lg flex items-center">{item.icon && <item.icon />}</span>
                    <span>{item.label}</span>
                    {router.pathname === "/home" && item.id === "dashboard" && (
                      <span className="ml-auto h-2 w-2 rounded-full bg-dark-accent animate-pulse-subtle"></span>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-8 p-4 bg-dark-tertiary rounded-lg shadow-inner opacity-80 menu-item" style={{ opacity: 0 }}>
            <h3 className="text-dark-accent font-medium mb-2">Time Tracker</h3>
            <p className="text-sm text-dark-muted">Track your productivity and manage your tasks efficiently.</p>
          </div>
        </div>

        <div className="absolute bottom-6 left-0 w-full px-6">
          <button
            onClick={handleLogout}
            className="btn-primary w-full flex justify-center items-center gap-2 py-2 transition-all duration-200 hover:shadow-glow transform hover:-translate-y-0.5"
          >
            <FiLogOut />
            <span>Logout</span>
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
