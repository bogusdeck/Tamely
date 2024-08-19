import React from "react";

const CompleteTasks = ({ data }) => {
  return (
    <div className="overflow-x-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">Complete Tasks</h2>
      <table className="min-w-full">
        <thead className="yellowbg blacktxt">
          <tr>
            <th className="py-3 px-4 text-left">Title</th>
            <th className="py-3 px-4 text-left">Status</th>
            <th className="py-3 px-4 text-left">Start Date</th>
            <th className="py-3 px-4 text-left">Total Time</th>
            <th className="py-3 px-4 text-left">End Date</th>
          </tr>
        </thead>
        <tbody className="text-gray-700">
          {data.map((item) => (
            <tr key={item.id}>
              <td className="py-3 px-4 yellowtxt">{item.title}</td>
              <td className="py-3 px-4 yellowtxt">{item.status}</td>
              <td className="py-3 px-4 yellowtxt">{item.startDate}</td>
              <td className="py-3 px-4 yellowtxt">{item.totalTime.toFixed(2)}</td>
              <td className="py-3 px-4 yellowtxt">{item.endDate}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompleteTasks;
