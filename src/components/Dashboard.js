import React, { useEffect, useRef } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import { FiPlay, FiPause, FiCheck, FiTrash2, FiList } from "react-icons/fi";

const Dashboard = function ({
  data,
  handleStart,
  handleStop,
  handleDone,
  handleDrop,
  timers,
}) {
  const tableRef = useRef(null);

  useEffect(() => {
    // Simple animation for table rows on load
    const rows = tableRef.current?.querySelectorAll('tbody tr');
    if (rows) {
      rows.forEach((row, index) => {
        setTimeout(() => {
          row.classList.add('animate-slide-in');
          row.style.opacity = 1;
        }, index * 50);
      });
    }
  }, [data]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const getStatusClass = (status) => {
    switch(status) {
      case 'Progress':
        return 'text-dark-accentSecondary font-medium animate-pulse-subtle';
      case 'Done':
        return 'text-green-400 font-medium';
      case 'Dropped':
        return 'text-red-400 font-medium';
      default:
        return 'text-dark-accent font-medium';
    }
  };

  return (
    <div className="overflow-hidden rounded-lg shadow-dark-lg bg-dark-secondary bg-opacity-80 backdrop-blur-sm animate-fade-in">
      <div className="p-4 bg-gradient-to-r from-dark-tertiary to-dark-secondary">
        <h2 className="text-xl font-bold text-dark-accent mb-2 flex items-center">
          <FiList className="mr-2" />
          <span>Active Tasks</span>
        </h2>
        <p className="text-dark-muted text-sm">Track your time on different tasks</p>
      </div>
      
      <div className="overflow-x-auto">
        <table ref={tableRef} className="min-w-full">
          <thead className="table-header sticky top-0 z-10">
            <tr>
              <th className="py-3 px-4 text-left font-medium">Title</th>
              <th className="py-3 px-4 text-left font-medium w-24">Status</th>
              <th className="py-3 px-4 text-left font-medium">Start Date</th>
              <th className="py-3 px-4 text-left font-medium">Time</th>
              <th className="py-3 px-4 text-left font-medium">Total Time</th>
              <th className="py-3 px-4 text-center font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((item, index) => (
                <tr
                  key={item.id}
                  className="table-row transition-all duration-200 hover:bg-dark-tertiary"
                  style={{ opacity: 0 }}
                >
                  <td className="py-3 px-4 text-dark-text font-medium">{item.title}</td>
                  <td className={`py-3 px-4 w-24 ${getStatusClass(item.status)}`}>
                    <div className="min-w-[70px]">{item.status}</div>
                  </td>
                  <td className="py-3 px-4 text-dark-muted">{item.startDate}</td>
                  <td className="py-3 px-4 text-dark-text">
                    {item.status === "Progress" ? (
                      <span className="font-mono font-medium text-dark-accentSecondary">
                        {formatTime(item.time)}
                      </span>
                    ) : (
                      <span className="font-mono">{formatTime(item.time)}</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-dark-text font-mono">{formatTime(item.totalTime)}</td>
                  <td className="py-3 px-4 flex items-center justify-center space-x-3">
                    {item.status === "Progress" ? (
                      <button
                        onClick={() => handleStop(index)}
                        className="p-2 rounded-full bg-dark-hover hover:bg-dark-border hover:shadow-glow-blue transition-all duration-200 transform hover:scale-110"
                        title="Pause"
                      >
                        <FiPause className="h-6 w-6 text-dark-accentSecondary" />
                      </button>
                    ) : (
                      <button
                        onClick={() => handleStart(index)}
                        className="p-2 rounded-full bg-dark-hover hover:bg-dark-border hover:shadow-glow-blue transition-all duration-200 transform hover:scale-110"
                        title="Play"
                      >
                        <FiPlay className="h-6 w-6 text-dark-accentSecondary" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDone(index)}
                      className="p-2 rounded-full bg-dark-hover hover:bg-green-800 hover:shadow-glow transition-all duration-200 transform hover:scale-110"
                      title="Mark as Done"
                    >
                      <FiCheck className="h-6 w-6 text-green-400" />
                    </button>
                    <button
                      onClick={() => handleDrop(index)}
                      className="p-2 rounded-full bg-dark-hover hover:bg-red-800 hover:shadow-glow transition-all duration-200 transform hover:scale-110"
                      title="Drop Task"
                    >
                      <FiTrash2 className="h-6 w-6 text-red-400" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="py-8 px-4 text-center text-dark-muted">
                  No active tasks. Add a new task to get started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
