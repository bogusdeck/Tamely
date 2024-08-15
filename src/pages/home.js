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
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasks = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setData(tasks);

      setTimers(
        tasks.map((task) => ({
          elapsedTime: task.time || 0,
          elapsedTotalTime: task.totalTime || 0,
          running: false,
          startCycleTime: null,
        })),
      );
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      for (let i = 0; i < timers.length; i++) {
        if (timers[i].running) {
          const elapsedCycleTime =
            (Date.now() - timers[i].startCycleTime) / 1000;
          const elapsedTime = timers[i].elapsedTime + elapsedCycleTime;
          const elapsedTotalTime =
            timers[i].elapsedTotalTime + elapsedCycleTime;

          const taskRef = doc(db, "tasks", data[i].id);
          await updateDoc(taskRef, {
            time: elapsedTime,
            totalTime: elapsedTotalTime,
            status: "Hault",
          });
        }
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [timers, data]);

  const handleStart = async (index) => {
    const updatedTimers = [...timers];
    if (!updatedTimers[index].running) {
      updatedTimers[index].running = true;
      updatedTimers[index].startCycleTime = Date.now();
      updatedTimers[index].elapsedTime = 0;
      setTimers(updatedTimers);

      const taskRef = doc(db, "tasks", data[index].id);
      const taskDoc = await getDoc(taskRef);
      const currentTotalTime = taskDoc.exists()
        ? taskDoc.data().totalTime || 0
        : 0;

      await updateDoc(taskRef, {
        status: "Progress",
        time: 0,
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

      const taskRef = doc(db, "tasks", data[index].id);
      await updateDoc(taskRef, {
        time: updatedTimers[index].elapsedTime,
        totalTime: updatedTimers[index].elapsedTotalTime,
        status: "Hault",
      });
      setTimers(updatedTimers);
    }
  };

  const [formData, setFormData] = useState({
    title: "",
    status: "hault",
    startDate: "",
    time: 0,
    totalTime: 0,
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

    const taskToAdd = {
      ...formData,
      status: "Hault",
      time: 0,
      totalTime: 0,
    };

    try {
      await addDoc(collection(db, "tasks"), taskToAdd);

      console.log("Task successfully added to Firestore");
    } catch (error) {
      console.error("Error adding task to Firestore:", error);
    }
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
        timers={timers}
      />
    </div>
  );
}
