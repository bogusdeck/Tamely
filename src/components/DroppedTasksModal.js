import React, { useState, useEffect, useRef } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../lib/firebase";
import { useAuth } from "../lib/useAuth";
import { FiTrash2, FiAlertCircle } from "react-icons/fi";

const DroppedTasksModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [droppedTasks, setDroppedTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef(null);

  useEffect(() => {
    const fetchDroppedTasks = async () => {
      if (!user?.email) return;

      setIsLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, user.email));
        const droppedTasksData = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          if (data.status === "Dropped") {
            droppedTasksData.push({ id: doc.id, ...data });
          }
        });

        setDroppedTasks(droppedTasksData);
      } catch (error) {
        console.error("Error fetching dropped tasks: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      fetchDroppedTasks();
    }
  }, [isOpen, user?.email]);

  useEffect(() => {
    // Animation for table rows
    if (!isLoading && droppedTasks.length > 0) {
      const rows = document.querySelectorAll('.task-row');
      rows.forEach((row, index) => {
        setTimeout(() => {
          row.classList.add('animate-slide-up');
          row.style.opacity = 1;
        }, 100 + (index * 50));
      });
    }

    // Handle escape key to close modal
    const handleEscKey = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [isOpen, isLoading, droppedTasks.length, onClose]);

  // Handle click outside to close
  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm animate-fade-in">
      <div 
        ref={modalRef}
        className="bg-gradient-to-b from-dark-secondary to-dark-tertiary rounded-lg shadow-dark-lg w-full max-w-4xl max-h-[80vh] overflow-hidden transform transition-all duration-300 animate-slide-up"
      >
        <div className="flex justify-between items-center p-5 border-b border-dark-border bg-dark-tertiary">
          <h2 className="text-xl font-bold text-dark-accent flex items-center">
            <FiTrash2 className="mr-2" />
            <span>Dropped Tasks</span>
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-dark-hover transition-all duration-200 transform hover:rotate-90"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 text-dark-text"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </button>
        </div>
        <div className="p-5 overflow-auto max-h-[calc(80vh-5rem)]">
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-bounce-subtle text-dark-accent text-xl">
                Loading...
              </div>
            </div>
          ) : droppedTasks.length > 0 ? (
            <div className="overflow-hidden rounded-lg shadow-dark">
              <table className="min-w-full">
                <thead className="table-header sticky top-0 z-10">
                  <tr>
                    <th className="py-3 px-4 text-left font-medium">Title</th>
                    <th className="py-3 px-4 text-left font-medium">Start Date</th>
                    <th className="py-3 px-4 text-left font-medium">Total Time</th>
                  </tr>
                </thead>
                <tbody>
                  {droppedTasks.map((task, index) => (
                    <tr 
                      key={task.id} 
                      className="task-row table-row hover:bg-dark-tertiary" 
                      style={{ opacity: 0 }}
                    >
                      <td className="py-3 px-4 text-dark-text font-medium">{task.title}</td>
                      <td className="py-3 px-4 text-dark-muted">{task.startDate}</td>
                      <td className="py-3 px-4 text-dark-text font-mono">
                        {formatTime(task.totalTime)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12 bg-dark-tertiary bg-opacity-50 rounded-lg">
              <div className="text-5xl mb-4 text-dark-muted">
                <FiAlertCircle className="inline-block" />
              </div>
              <p className="text-dark-muted">No dropped tasks found.</p>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-dark-border flex justify-end">
          <button 
            onClick={onClose}
            className="btn-outline px-6"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DroppedTasksModal;
