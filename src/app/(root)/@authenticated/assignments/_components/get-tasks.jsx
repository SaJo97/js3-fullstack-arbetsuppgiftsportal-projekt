"use client";

import { useAuth } from "@/context/authContext";
import { useTasks } from "@/context/tasksContext";
import { UserTasks } from "./user-tasks";
export const GetTasks = () => {
  const { tasks, loading } = useTasks();
  const { user } = useAuth();

  if (loading) {
    return <div>Laddar uppgifter...</div>;
  }
  if (!user) {
    return <div>Logga in för att se dina uppgifter.</div>;
  }

  // Filter tasks for the current user
  const userTasks = tasks.filter((task) => task.ownerId === user.uid);

  // Group tasks by uniqueTaskId
  const tasksByUniqueId = userTasks.reduce((user, task) => {
    if (!user[task.uniqueTaskId]) {
      user[task.uniqueTaskId] = [];
    }
    user[task.uniqueTaskId].push(task);
    return user;
  }, {});

  // Create a map to store unique tasks by uniqueTaskId where not all recurring tasks are completed
  const uniqueTasksMap = new Map();
  // Returns array of given object - static method
  Object.entries(tasksByUniqueId).forEach(([uniqueTaskId, taskGroup]) => {
    // Check if all tasks for this uniqueTaskId are completed
    const allCompleted = taskGroup.every((task) => task.completed === true);
    // Only add if not all completed
    if (!allCompleted) {
      // Add the first task in the group to represent this uniqueTaskId
      uniqueTasksMap.set(uniqueTaskId, taskGroup[0]);
    }
  });

  // Convert the map back to an array
  const uniqueTasks = Array.from(uniqueTasksMap.values());

  return (
    <div>
      <h1 className="text-2xl font-bold mb-5">Dina uppgifter</h1>
      {userTasks.length === 0 ? (
        <p>Inga uppgifter hittades.</p>
      ) : uniqueTasks.length === 0 ? (
        <p>Alla uppgifter är kompletta!</p>
      ) : (
        <UserTasks tasks={uniqueTasks} />
      )}
    </div>
  );
};
