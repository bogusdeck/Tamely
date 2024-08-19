import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../lib/useAuth";
import Dashboard from "../components/Dashboard";
import CompleteTasks from "../components/CompleteTasks";
import { db } from "../lib/firebase";
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  onSnapshot,
  getDoc,
  setDoc,
} from "firebase/firestore";
import Sidebar from "@/components/sidebar";
import ProjectLog from "@/components/project-log";

export default function HomePage() {
  const { user } = useAuth();
  const [activeTasks, setActiveTasks] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);
  const [timers, setTimers] = useState([]);
  const counterRef = useRef(0); // Counter ref to keep track of interval ticks
  const [isProjectLogVisible, setIsProjectLogVisible] = useState(false);

  useEffect(() => {
    if (user) {
      const userCollectionRef = collection(db, user.email);

      // Ensure e the user collection is created if it doesn't exist
      const initializeUserCollection = async () => {
        try {
          const userDocRef = doc(userCollectionRef, "initialDocument");
          const userDocSnapshot = await getDoc(userDocRef);

          if (!userDocSnapshot.exists()) {
            await setDoc(userDocRef, { initialized: true });
          }
        } catch (error) {
          console.error("Error initializing user collection:", error);
        }
      };

      initializeUserCollection();

      const unsubscribe = onSnapshot(userCollectionRef, (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const active = tasks.filter(
          (task) => task.status === "Progress" || task.status === "Hault",
        );
        const completed = tasks.filter((task) => task.status === "Done");

        setActiveTasks(active);
        setCompletedTasks(completed);

        setTimers(
          active.map((task) => ({
            elapsedTime: task.time || 0,
            elapsedTotalTime: task.totalTime || 0,
            running: task.status === "Progress",
            startCycleTime: task.status === "Progress" ? Date.now() : null,
          })),
        );
      });

      return () => unsubscribe();
    }
  }, [user]);

  useEffect(() => {
    const combinedInterval = setInterval(() => {
      // Increment counter
      counterRef.current += 1;

      // UI Update
      setActiveTasks((prevTasks) =>
        prevTasks.map((item, index) => {
          if (timers[index]?.running) {
            const elapsedCycleTime =
              (Date.now() - timers[index].startCycleTime) / 1000;
            return {
              ...item,
              time: (timers[index].elapsedTime + elapsedCycleTime).toFixed(2),
              totalTime: (
                timers[index].elapsedTotalTime + elapsedCycleTime
              ).toFixed(2),
            };
          }
          return item;
        }),
      );

      // Firebase Update every 30 seconds
      if (counterRef.current >= 30) {
        console.log("Firebase update interval running");
        const activeProgressTasks = activeTasks.filter(
          (task) => task.status === "Progress",
        );

        if (activeProgressTasks.length > 0) {
          Promise.all(
            activeProgressTasks.map(async (task, index) => {
              const timerIndex = activeTasks.findIndex((t) => t.id === task.id);
              if (timers[timerIndex]?.running) {
                const elapsedCycleTime =
                  (Date.now() - timers[timerIndex].startCycleTime) / 1000;

                const updatedElapsedTime =
                  timers[timerIndex].elapsedTime + elapsedCycleTime;
                const updatedElapsedTotalTime =
                  timers[timerIndex].elapsedTotalTime + elapsedCycleTime;

                const taskRef = doc(db, user.email, task.id);
                await updateDoc(taskRef, {
                  time: updatedElapsedTime,
                  totalTime: updatedElapsedTotalTime,
                  status: "Progress",
                });

                setTimers((prevTimers) =>
                  prevTimers.map((timer, i) =>
                    i === timerIndex
                      ? {
                          ...timer,
                          elapsedTime: updatedElapsedTime,
                          elapsedTotalTime: updatedElapsedTotalTime,
                          startCycleTime: Date.now(),
                        }
                      : timer,
                  ),
                );

                setActiveTasks((prevTasks) =>
                  prevTasks.map((taskItem, i) =>
                    i === timerIndex
                      ? {
                          ...taskItem,
                          time: updatedElapsedTime,
                          totalTime: updatedElapsedTotalTime,
                        }
                      : taskItem,
                  ),
                );
              }
            }),
          ).catch((error) => console.error("Error updating Firestore:", error));
        }

        // Reset counter
        counterRef.current = 0;
      }
    }, 1000); // Runs every second

    return () => clearInterval(combinedInterval);
  }, [activeTasks, timers, user]);

  const handleStart = async (index) => {
    const updatedTimers = [...timers];
    if (!updatedTimers[index].running) {
      updatedTimers[index].running = true;
      updatedTimers[index].startCycleTime = Date.now();
      updatedTimers[index].elapsedTime = 0;

      const taskRef = doc(db, user.email, activeTasks[index].id);
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

      const taskRef = doc(db, user.email, activeTasks[index].id);
      await updateDoc(taskRef, {
        time: updatedTimers[index].elapsedTime,
        totalTime: updatedTimers[index].elapsedTotalTime,
        status: "Hault",
      });
      setTimers(updatedTimers);
    }
  };

  const handleDone = async (index) => {
    const updatedTimers = [...timers];
    if (updatedTimers[index].running) {
      // Stop the timer if it's running
      updatedTimers[index].running = false;
      const elapsedCycleTime =
        (Date.now() - updatedTimers[index].startCycleTime) / 1000;
      updatedTimers[index].elapsedTime += elapsedCycleTime;
      updatedTimers[index].elapsedTotalTime += elapsedCycleTime;
    }

    const taskRef = doc(db, user.email, activeTasks[index].id);
    const endDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    await updateDoc(taskRef, {
      time: updatedTimers[index].elapsedTime,
      totalTime: updatedTimers[index].elapsedTotalTime,
      status: "Done",
      endDate: endDate,
    });

    setTimers(updatedTimers);
  };

  const handleDrop = async (index) => {
    const updatedTimers = [...timers];
    if (updatedTimers[index].running) {
      // Stop the timer if it's running
      updatedTimers[index].running = false;
      const elapsedCycleTime =
        (Date.now() - updatedTimers[index].startCycleTime) / 1000;
      updatedTimers[index].elapsedTime += elapsedCycleTime;
      updatedTimers[index].elapsedTotalTime += elapsedCycleTime;
    }

    const taskRef = doc(db, user.email, activeTasks[index].id);
    const endDate = new Date().toISOString().split("T")[0]; // Get today's date in YYYY-MM-DD format

    await updateDoc(taskRef, {
      time: updatedTimers[index].elapsedTime,
      totalTime: updatedTimers[index].elapsedTotalTime,
      status: "Dropped",
      endDate: endDate,
    });

    setTimers(updatedTimers);
  };

  const [formData, setFormData] = useState({
    title: "",
    status: "Hault",
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
      const userCollectionRef = collection(db, user.email);
      await addDoc(userCollectionRef, taskToAdd);
      console.log("Task successfully added to Firestore");
    } catch (error) {
      console.error("Error adding task to Firestore:", error);
    }
  };

  const toggleProjectLog = () => {
    setIsProjectLogVisible((prev) => !prev);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto mt-8">
      <Sidebar onProjectLogClick={toggleProjectLog} />
      <ProjectLog isVisible={isProjectLogVisible} onClose={toggleProjectLog} />
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.displayName}!</h1>
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={formData.title}
            onChange={handleChange}
            className="px-4 py-2 blacktxt font-medium"
            required
          />
          <input
            type="date"
            name="startDate"
            placeholder="Start Date"
            value={formData.startDate}
            onChange={handleChange}
            className="px-4 py-2 blacktxt font-medium"
            required
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 yellowbg blacktxt font-medium hover:scale-110"
        >
          Add Entry
        </button>
      </form>
      <Dashboard
        data={activeTasks}
        handleStart={handleStart}
        handleStop={handleStop}
        handleDone={handleDone}
        handleDrop={handleDrop}
        timers={timers}
      />
      <CompleteTasks data={completedTasks} />
    </div>
  );
}
