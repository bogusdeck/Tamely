import { useEffect, useState } from "react";
import { db, collection, query, where, getDocs } from "../lib/firebase";

export default function DroppedTasksModal({ onClose }) {
  const [droppedTasks, setDroppedTasks] = useState([]);

  useEffect(() => {
    const fetchDroppedTasks = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const tasksRef = collection(db, user.displayName);
          const q = query(tasksRef, where("status", "==", "Dropped"));
          const querySnapshot = await getDocs(q);
          const tasks = querySnapshot.docs.map((doc) => doc.data());
          setDroppedTasks(tasks);
        }
      } catch (error) {
        console.error("Error fetching dropped tasks: ", error);
      }
    };

    fetchDroppedTasks();
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Dropped Tasks</h2>
        <ul>
          {droppedTasks.length > 0 ? (
            droppedTasks.map((task, index) => (
              <li key={index} className="mb-2">
                <strong>Title:</strong> {task.title}
                <br />
                <strong>Time Spent:</strong> {task.totalTime}
              </li>
            ))
          ) : (
            <p>No dropped tasks found.</p>
          )}
        </ul>
        <button
          onClick={onClose}
          className="mt-4 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Close
        </button>
      </div>
    </div>
  );
}
