import React, { useState, useEffect, useRef } from "react";
import { FiUser, FiPlusCircle, FiClock } from "react-icons/fi";
import { useAuth } from "../lib/useAuth";
import Dashboard from "../components/Dashboard";
import CompleteTasks from "../components/CompleteTasks";
import Sidebar from "../components/Sidebar";
import ProjectLog from "../components/project-log";
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
    return (
      <div className="min-h-screen bg-dark-primary flex items-center justify-center">
        <div className="text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-r from-dark-accent to-dark-accentSecondary mx-auto flex items-center justify-center animate-pulse shadow-glow-accent">
            <FiClock className="text-4xl text-dark-primary" />
          </div>
          <h2 className="mt-6 text-2xl font-bold text-dark-accent animate-bounce-subtle">Loading Tamely</h2>
          <p className="mt-2 text-dark-muted">Please wait while we prepare your dashboard</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-primary">
      <Sidebar onProjectLogClick={toggleProjectLog} />
      <ProjectLog isVisible={isProjectLogVisible} onClose={toggleProjectLog} />
      
      <div className="container mx-auto pt-8 px-4 pb-16 animate-fade-in">
        <div className="flex items-center mb-8 animate-slide-up">
          <div className="w-12 h-12 rounded-full bg-gradient-to-r from-dark-accent to-dark-accentSecondary flex items-center justify-center mr-4 shadow-glow-accent">
            <FiUser className="text-xl text-dark-primary" />
          </div>
          <h1 className="text-3xl font-bold text-dark-text">
            Welcome, <span className="text-dark-accent">{user.displayName}</span>!
          </h1>
        </div>
        
        <div className="bg-gradient-to-b from-dark-secondary to-dark-tertiary rounded-lg shadow-dark-lg p-6 mb-8 animate-slide-up" style={{animationDelay: '100ms'}}>
          <h2 className="text-xl font-bold text-dark-accent mb-4 flex items-center">
            <FiPlusCircle className="mr-2" />
            <span>Create New Task</span>
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="relative">
                <input
                  type="text"
                  name="title"
                  placeholder="Task Title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-primary border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-transparent text-dark-text transition-all duration-200"
                  required
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none opacity-0 group-focus-within:opacity-100 transition-opacity duration-200">
                  <span className="text-dark-accent">📝</span>
                </div>
              </div>
              
              <div className="relative">
                <input
                  type="date"
                  name="startDate"
                  placeholder="Start Date"
                  value={formData.startDate}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-dark-primary border border-dark-border rounded-lg focus:outline-none focus:ring-2 focus:ring-dark-accent focus:border-transparent text-dark-text transition-all duration-200"
                  required
                />
              </div>
              
              <div>
                <button
                  type="submit"
                  className="w-full px-6 py-3 bg-dark-accent text-dark-primary font-medium rounded-lg hover:shadow-glow-accent transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add New Task
                </button>
              </div>
            </div>
          </form>
        </div>
        
        <div className="space-y-10">
          <div className="animate-slide-up" style={{animationDelay: '200ms'}}>
            <Dashboard
              data={activeTasks}
              handleStart={handleStart}
              handleStop={handleStop}
              handleDone={handleDone}
              handleDrop={handleDrop}
              timers={timers}
            />
          </div>

          <div className="animate-slide-up" style={{animationDelay: '300ms'}}>
            <CompleteTasks data={completedTasks} />
          </div>
        </div>
      </div>
    </div>
  );
}
