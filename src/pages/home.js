import React, { useState, useEffect } from "react";
import { useAuth } from "../lib/useAuth";
import Dashboard from "../components/Dashboard";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
} from "firebase/firestore";

export default function HomePage() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [timers, setTimers] = useState([]);

  useEffect(() => {
    // Set up real-time listener for tasks collection
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(tasks);

      // Initialize timers with data from Firestore
      setTimers(
        tasks.map((task) => ({
          elapsedTime: task.time || 0,
          elapsedTotalTime: task.totalTime || 0,
          running: task.status === "Progress",
          startCycleTime: task.startCycleTime || null,
        })),
      );
    });

    return () => unsubscribe();
  }, []);

  const handleStart = async (index) => {
    const updatedTimers = [...timers];
    if (!updatedTimers[index].running) {
      updatedTimers[index].running = true;
      updatedTimers[index].startCycleTime = Date.now();
      updatedTimers[index].elapsedTime = 0; // Reset the time to 0 when starting
      setTimers(updatedTimers);

      // Fetch the current task data to get the existing total time
      const taskRef = doc(db, "tasks", data[index].id);
      const taskDoc = await getDoc(taskRef); // Use getDoc to retrieve the document
      const currentTotalTime = taskDoc.exists()
        ? taskDoc.data().totalTime || 0
        : 0;

      // Update the task status to "Progress" and reset time while keeping totalTime
      await updateDoc(taskRef, {
        status: "Progress",
        time: 0, // Reset time to 0
        startCycleTime: Date.now(), // Set the start cycle time
      });

      updatedTimers[index].elapsedTotalTime = currentTotalTime;
      setTimers(updatedTimers);
    }
  };

  const handleStop = async (index) => {
    const updatedTimers = [...timers];
    if (updatedTimers[index].running) {
      updatedTimers[index].running = false;
      const elapsedCycleTime =
        (Date.now() - updatedTimers[index].startCycleTime) / 1000;
      updatedTimers[index].elapsedTime += elapsedCycleTime;
      updatedTimers[index].elapsedTotalTime += elapsedCycleTime;

      // Update the task in Firestore
      const taskRef = doc(db, "tasks", data[index].id);
      await updateDoc(taskRef, {
        time: updatedTimers[index].elapsedTime, // Store time for the current session
        totalTime: updatedTimers[index].elapsedTotalTime, // Store cumulative time
        status: "Hault", // Change status to "Hault" when stopped
        startCycleTime: null, // Clear start cycle time
      });
      setTimers(updatedTimers);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    status: "Progress",
    startDate: "",
    time: 0, // Store time in seconds
    totalTime: 0, // Store total time in seconds
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Add the task to Firestore
    const docRef = await addDoc(collection(db, "tasks"), formData);

    const newTask = { ...formData, id: docRef.id };
    setData((prevData) => [...prevData, newTask]);
    setTimers((prevTimers) => [
      ...prevTimers,
      {
        elapsedTime: 0,
        elapsedTotalTime: 0,
        running: false,
        startCycleTime: null,
      },
    ]);

    setFormData({
      title: "",
      status: "Progress",
      startDate: "",
      time: 0,
      totalTime: 0,
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const updatedData = data.map((item, index) => {
        if (timers[index]?.running) {
          const elapsedCycleTime =
            (Date.now() - timers[index].startCycleTime) / 1000;
          const elapsedTotalTime =
            timers[index].elapsedTotalTime + elapsedCycleTime;

          const time = (timers[index].elapsedTime + elapsedCycleTime).toFixed(
            2,
          );
          const totalTime = elapsedTotalTime.toFixed(2);

          return { ...item, time, totalTime };
        }
        return item;
      });
      setData(updatedData);
    }, 1000);

    return () => clearInterval(interval);
  }, [data, timers]);

  useEffect(() => {
    const handleBeforeUnload = async (event) => {
      for (let i = 0; i < timers.length; i++) {
        if (timers[i].running) {
          const elapsedCycleTime =
            (Date.now() - timers[i].startCycleTime) / 1000;
          const updatedTotalTime =
            timers[i].elapsedTotalTime + elapsedCycleTime;

          // Update the task status to "Hault" and save current time and totalTime
          const taskRef = doc(db, "tasks", data[i].id);
          await updateDoc(taskRef, {
            time: timers[i].elapsedTime + elapsedCycleTime, // Store time for the current session
            totalTime: updatedTotalTime, // Store cumulative time
            status: "Hault", // Change status to "Hault" when stopped
            startCycleTime: null, // Clear start cycle time
          });
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [data, timers]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.displayName}!</h1>

      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="px-4 py-2 border rounded-md"
            required
          />
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="px-4 py-2 border rounded-md"
            required
          >
            <option value="Progress">Progress</option>
            <option value="Done">Done</option>
            <option value="Hault">Hault</option>
            <option value="Dropped">Dropped</option>
          </select>
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={handleChange}
            className="px-4 py-2 border rounded-md"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Entry
        </button>
      </form>

      <Dashboard
        data={data}
        handleStart={handleStart}
        handleStop={handleStop}
        timers={timers} // Pass the timers state here
      />
    </div>
  );
}
