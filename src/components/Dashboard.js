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
      <table className="min-w-full blackbg">
        <thead className="yellowbg blacktxt">
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
              <td className="py-3 px-4 yellowtxt">{item.title}</td>
              <td className="py-3 px-4 yellowtxt">{item.status}</td>
              <td className="py-3 px-4 yellowtxt">{item.startDate}</td>
              <td className="py-3 px-4 yellowtxt">{formatTime(item.time)}</td>
              <td className="py-3 px-4 yellowtxt">{formatTime(item.totalTime)}</td>
              <td className="py-3 px-4 flex items-center justify-center">
                {item.status === "Progress" ? (
                  <button
                    onClick={() => handleStop(index)}
                    className="px-2 py-1"
                  >
                    <img src="pause.png" className="h-8" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleStart(index)}
                    className="px-2 py-1"
                  >
                    <img src="play.png" className="h-8 "></img>
                  </button>
                )}
                <button
                  onClick={() => handleDone(index)}
                  className="px-2 py-1"
                >
                  <img className="h-8 " src="done.png"></img>
                </button>
                <button
                  onClick={() => handleDrop(index)}
                  className="px-2 py-1"
                >
                  <img className="h-8 " src="drop.png" ></img>
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
