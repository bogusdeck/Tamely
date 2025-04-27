// src/components/Clock.js
import { useState, useEffect } from "react";

export default function Clock() {
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <h1 className="text-6xl font-bold">{time}</h1>
    </div>
  );
}
