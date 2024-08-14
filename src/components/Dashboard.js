import React, { useEffect } from "react";
import { getNotionTable } from "@/lib/notion";

export default function Dashboard() {
  const [notionData, setNotionData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getNotionTable();
      setNotionData(data);
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading) return <div>Loading....</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Title</th>
            <th className="py-2 px-4 border-b">Start Date</th>
            <th className="py-2 px-4 border-b">End Date</th>
            <th className="py-2 px-4 border-b">Total Time</th>
            <th className="py-2 px-4 border-b">Estimated Time</th>
            <th className="py-2 px-4 border-b">Status</th>
          </tr>
        </thead>
        <tbody>
          {notionData.map((row) => (
            <tr key={row.id}>
              <td className="py-2 px-4 border-b">{row.title}</td>
              <td className="py-2 px-4 border-b">{row.startDate}</td>
              <td className="py-2 px-4 border-b">{row.endDate}</td>
              <td className="py-2 px-4 border-b">{row.totalTime}</td>
              <td className="py-2 px-4 border-b">{row.estimatedTime}</td>
              <td className="py-2 px-4 border-b">{row.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
