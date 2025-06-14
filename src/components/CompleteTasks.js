import React, { useEffect, useRef } from "react";
import { FiCheckCircle, FiTarget } from "react-icons/fi";

const CompleteTasks = function ({ data }) {
  const tableRef = useRef(null);
  
  useEffect(() => {
    // Animate table rows on component mount
    if (tableRef.current) {
      const rows = tableRef.current.querySelectorAll('tbody tr');
      rows.forEach((row, index) => {
        row.style.opacity = '0';
        row.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
          row.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
          row.style.opacity = '1';
          row.style.transform = 'translateY(0)';
        }, 100 + (index * 50)); // Staggered animation
      });
    }
  }, [data]);
  
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <div className="overflow-hidden mt-8 animate-fade-in rounded-lg shadow-dark-lg bg-gradient-to-b from-dark-secondary to-dark-tertiary">
      <div className="p-6 border-b border-dark-border">
        <h2 className="text-2xl font-bold text-dark-accent flex items-center">
          <FiCheckCircle className="mr-3" />
          <span>Complete Tasks</span>
        </h2>
        <p className="text-dark-muted mt-2">Tasks you've successfully completed</p>
      </div>
      
      {data.length > 0 ? (
        <div className="overflow-x-auto" ref={tableRef}>
          <table className="min-w-full">
            <thead className="table-header sticky top-0 z-10">
              <tr>
                <th className="py-3 px-4 text-left font-medium">Title</th>
                <th className="py-3 px-4 text-left font-medium">Status</th>
                <th className="py-3 px-4 text-left font-medium">Start Date</th>
                <th className="py-3 px-4 text-left font-medium">Total Time</th>
                <th className="py-3 px-4 text-left font-medium">End Date</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr 
                  key={item.id} 
                  className="table-row hover:bg-dark-tertiary"
                >
                  <td className="py-3 px-4 text-dark-text font-medium">{item.title}</td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {item.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-dark-muted">{item.startDate}</td>
                  <td className="py-3 px-4 text-dark-text font-mono">
                    {formatTime(item.totalTime)}
                  </td>
                  <td className="py-3 px-4 text-dark-muted">{item.endDate}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-12 bg-dark-tertiary bg-opacity-50">
          <div className="text-5xl mb-4 text-dark-muted">
            <FiTarget className="inline-block" />
          </div>
          <p className="text-dark-muted">No completed tasks yet</p>
          <p className="text-dark-text mt-2">Complete tasks will appear here</p>
        </div>
      )}
    </div>
  );
};

export default CompleteTasks;
