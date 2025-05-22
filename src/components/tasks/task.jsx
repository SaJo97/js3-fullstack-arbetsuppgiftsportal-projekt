"use client";

import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";

export const Task = ({ task, handleComplete, index, accentColor }) => {
  const [message, setMessage] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState("");
  const taskRef = useRef(null); // To reference the task div

  // Close the task when clicking outside the task div
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (taskRef.current && !taskRef.current.contains(event.target)) {
        setIsCompleting(false); // Close the task
      }
    };

    // Add the event listener when the component mounts
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Remove the event listener when the component unmounts
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTaskClick = () => {
    setIsCompleting(true);
  };
  const handleSaveMessage = () => {
    if (!message.trim()) {
      setError("Beskriv kortfattat vad du gjort innan du lämnar in!");
      return;
    }
    handleComplete(task.id, message);
    setMessage("");
    setIsCompleting(false);
    setError(""); // Clear error if message is valid
  };

  return (
    <Delay delay={100 * index}>
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        transition={{
          x: { type: "spring", bounce: 0, duration: 0.5 },
          opacity: { duration: 0.4 },
        }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 100 }}
        key={task.id}
        className="p-4 shadow-sm bg-background rounded-lg "
        onClick={handleTaskClick}
        ref={taskRef} // Attach ref to the task div
        style={{ backgroundColor: accentColor }}
      >
        <div className="flex justify-between items-center flex-col">
          <span className="text-xl font-semibold">{task.title}</span>
          <span className="text-sm font-bold">Deadline: {task.deadline}</span>
        </div>
        {isCompleting && (
          <div className="mt-2">
            {" "}
            Beskriv kortfattat vad som gjorts...
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-2 border rounded"
            />
            {error && <div className="text-red-500 text-sm mt-2">{error}</div>}{" "}
            {/* Display error message */}
            <button
              onClick={handleSaveMessage}
              className="mt-2 bg-blue-500 text-white p-2 rounded cursor-pointer"
            >
              Klar!
            </button>
          </div>
        )}
      </motion.div>
    </Delay>
  );
};

export const Delay = ({ children, delay }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  if (!visible) return null;

  return <>{children}</>;
};
