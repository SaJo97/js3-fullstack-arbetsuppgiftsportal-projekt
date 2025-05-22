"use client";

import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { useAuth } from "./authContext";
import { format } from "date-fns";
import { db } from "@/lib/firebase";

const {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
} = require("react");

const TasksContext = createContext();

export const TasksProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState([]);
  const { isAdmin, authLoaded, user } = useAuth();

  //   const getUniqueTasks = (tasks) => {
  //   const uniqueTasks = new Map();
  //   tasks.forEach(task => {
  //     if (!uniqueTasks.has(task.uniqueTaskId)) { // Use title or any unique identifier
  //       uniqueTasks.set(task.uniqueTaskId, task);
  //     }
  //   });
  //   return Array.from(uniqueTasks.values());
  // }
  // useEffect to fetch tasks from Firestore when user is authenticated
  useEffect(() => {
    if (!authLoaded || !user) return;

    setLoading(true);

    let q;
    // If the user is an admin, fetch all tasks; otherwise, fetch tasks for the specific user
    if (isAdmin()) {
      q = query(collection(db, "tasks"), orderBy("date"), orderBy("order"));
    } else {
      q = query(
        collection(db, "tasks"),
        where("ownerId", "==", user.uid), // Filter tasks by user ID
        orderBy("date"),
        orderBy("order")
      );
    }
    // Subscribe to the query and update tasks when data changes
    const unsub = onSnapshot(q, (querySnap) => {
      const updatedTasks = querySnap.docs.map((doc) => ({
        id: doc.id, // Get document ID
        ...doc.data(), // Spread the document data
      }));
      // const uniqueTasks = getUniqueTasks(updatedTasks); // Get unique tasks
      // setTasks(uniqueTasks);
      setTasks(updatedTasks);
      setLoading(false);
    });

    return () => unsub(); // Cleanup subscription on component unmount
  }, [isAdmin, user]); // Dependency array to re-run effect when isAdmin or user changes
  // Function to get the next order value for a new task
  const getNextOrder = () => {
    return Math.max(...tasks.map((task) => task.order ?? 0), 0) + 1000; // Calculate next order value
  };
  // Function to add a new task
  const addTask = async (taskData, deadline) => {
    if (!isAdmin()) return;
    setLoading(true);

    try {
      const newTask = {
        ...taskData,
        date: format(taskData.date, "yyyy-MM-dd"),
        deadline: format(deadline, "yyyy-MM-dd"),
        order: getNextOrder(),
        completed: false,
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, "tasks"), newTask); // Add new task to Firestore
    } catch (error) {
      console.log(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Function to mark a task as completed
  const completeTask = async (taskId, message) => {
    setLoading(true);
    try {
      const taskRef = doc(db, "tasks", taskId); // Get reference to the task document
      await updateDoc(taskRef, {
        completed: true,
        completedat: Timestamp.now(),
        message: message,
      });
    } catch (error) {
      console.error("Fel vid uppdatering av uppgift", error);
    } finally {
      setLoading(false);
    }
  };
  // Function to save the order of tasks after reordering
  const saveReorder = async (orderdTasks, moved) => {
    setLoading(true);

    const prevTasks = tasks;

    setTasks(orderdTasks);

    const batch = writeBatch(db); // Create a batch for Firestore updates
    // Update the order of moved tasks in the batch
    moved.forEach(({ id, newOrder }) => {
      batch.update(doc(db, "tasks", id), { order: newOrder });
    });

    try {
      await batch.commit(); // Commit the batch update
    } catch (error) {
      console.error("Batch error:", error);
      setTasks(prevTasks); // Revert to previous tasks state on error
    } finally {
      setLoading(false);
    }
  };
  // Function to get tasks for a specific user on a specific date
  const getTaskByUserForDate = (uid, dateObj) => {
    const iso = useMemo(() => format(dateObj, "yyyy-MM-dd"), [dateObj]); // Format date to ISO string
    return useMemo(() => {
      return tasks
        .filter((task) => task.ownerId === uid && task.date === iso) // Filter tasks by user ID and date
        .sort((a, b) => a.order - b.order); // Sort tasks by order
    }, [tasks, uid, iso]); // Dependencies for memoization
  };
  // Context value to be provided to components
  const value = {
    addTask,
    loading,
    tasks,
    getTaskByUserForDate,
    completeTask,
    saveReorder,
  };

  return (
    <TasksContext.Provider value={value}>{children}</TasksContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) {
    throw new Error("useTasks must be used within an TasksProviders");
  }
  return context;
};
