import React, { useState, useEffect } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase"; // Import your Firestore instance
import { useAuth } from "@/lib/useAuth";

const DroppedTasksModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [droppedTasks, setDroppedTasks] = useState([]);

  useEffect(() => {
    const fetchDroppedTasks = async () => {
      if (user?.email) {
        const q = query(
          collection(db, user.email), // Direct collection for user email
          where("status", "==", "Dropped"),
        );

        try {
          const querySnapshot = await getDocs(q);
          const tasks = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setDroppedTasks(tasks);
        } catch (error) {
          console.error("Error fetching dropped tasks: ", error);
        }
      }
    };

    fetchDroppedTasks();
  }, [user?.email]);

  if (!isOpen) return null; // Do not render if the modal is not open

  return (
    <div className="modal-backdrop fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
      <div className="modal-content bg-white rounded-lg shadow-lg overflow-x-auto w-full max-w-4xl relative">
        <button
          className="close-button absolute top-2 right-2 text-gray-500 bg-gray-200 rounded-full p-2 hover:bg-gray-300"
          onClick={onClose}
        >
          &times;
        </button>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-4">Dropped Tasks</h2>
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="py-3 px-4 text-left">Title</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Start Date</th>
                <th className="py-3 px-4 text-left">Total Time</th>
                <th className="py-3 px-4 text-left">End Date</th>
              </tr>
            </thead>
            <tbody className="text-gray-700">
              {droppedTasks.length > 0 ? (
                droppedTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="py-3 px-4 border-b">{task.title}</td>
                    <td className="py-3 px-4 border-b">{task.status}</td>
                    <td className="py-3 px-4 border-b">{task.startDate}</td>
                    <td className="py-3 px-4 border-b">
                      {task.totalTime.toFixed(2)}
                    </td>
                    <td className="py-3 px-4 border-b">{task.endDate}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-3 px-4 text-center">
                    No dropped tasks
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DroppedTasksModal;
