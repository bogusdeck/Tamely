import React from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

const Dashboard = ({
  data,
  handleStart,
  handleStop,
  handleDone,
  handleDrop,
  timers,
}) => {
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Start Date</th>
            <th className="py-3 px-4 text-left">Time</th>
            <th className="py-3 px-4 text-left">Total Time</th>
            <th className="py-3 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((item, index) => (
            <tr key={item.id}>
              <td className="py-3 px-4">{item.title}</td>
              <td className="py-3 px-4">{item.status}</td>
              <td className="py-3 px-4">{item.startDate}</td>
              <td className="py-3 px-4">{formatTime(item.time)}</td>
              <td className="py-3 px-4">{formatTime(item.totalTime)}</td>
              <td className="py-3 px-4 space-x-2">
                {item.status === "Progress" ? (
                  <button
                    onClick={() => handleStop(index)}
                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                  >
                    Stop
                  </button>
                ) : (
                  <button
                    onClick={() => handleStart(index)}
                    className="px-2 py-1 bg-green-500 text-white rounded-md"
                  >
                    Start
                  </button>
                )}
                <button
                  onClick={() => handleDone(index)}
                  className="px-2 py-1 bg-blue-500 text-white rounded-md"
                >
                  Done
                </button>
                <button
                  onClick={() => handleDrop(index)}
                  className="px-2 py-1 bg-gray-500 text-white rounded-md"
                >
                  Drop
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;
