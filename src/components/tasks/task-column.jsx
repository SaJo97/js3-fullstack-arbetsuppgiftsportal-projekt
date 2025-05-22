"use client";

import { cn } from "@/lib/utils";
import { TaskList } from "./task-list";
import { useTasks } from "@/context/tasksContext";
import { useAuth } from "@/context/authContext";
import { Switch } from "../ui/switch";
import { useRef, useState } from "react";
import { TaskProgress } from "./task-progress";
import { TaskReorder } from "./task.reoder";
import { useConfetti } from "@/context/confettiContex";
import Link from "next/link";
import { PlusIcon } from "lucide-react";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { getReadableTextColor, shade } from "@/utils/color";

export const TaskColumn = ({ date, user, className }) => {
  const [isReordering, setIsReordering] = useState(false);
  const [localTasks, setLocalTasks] = useState([]);

  const movedTasks = useRef([]);

  const { getTaskByUserForDate, completeTask, saveReorder } = useTasks();

  const tasks = getTaskByUserForDate(user.uid, date);

  const notCompleted = tasks.filter((task) => !task.completed);

  const { isAdmin } = useAuth();
  const { showConfetti } = useConfetti();

  const handleComplete = async (taskId, message) => {
    completeTask(taskId, message);

    // Check if this task's deadline matches the selected date
    const completedTask = tasks.find((task) => task.id === taskId);
    const taskDeadline = new Date(completedTask.deadline);
    const selectedDate = new Date(date);

    // Check if the task's deadline is the same as the selected date
    if (taskDeadline.toDateString() === selectedDate.toDateString()) {
      // Trigger confetti
      showConfetti();
    }
    // check if the task's last one of the day
    // if(tasks.length > 0 && notCompleted.length === 1) {
    //   showConfetti()
    // }
  };
  // Function to start reordering tasks
  const startReorder = () => {
    const deep = tasks
      .filter((t) => !t.completed) // Filter out completed tasks
      .map((t) => ({ ...t })); // Create a shallow copy of the tasks

    movedTasks.current = []; // Reset moved tasks
    setLocalTasks(deep); // Set local tasks for reordering
  };
  // Function to handle changes in the reorder switch
  const handleCheckChange = (checked) => {
    if (!checked) {
      // If switching off reorder mode, save the order to the database
      const payload = movedTasks.current.filter((mt) => {
        const original = localTasks.find((t) => t.id === mt.id);
        return original && original.order !== mt.newOrder; // Check if the order has changed
      });
      // console.log({payload})
      // If there are changes, save the new order
      if (payload.length > 0) {
        saveReorder(localTasks, payload);
      }
    } else {
      startReorder(); // Start reordering if the switch is checked
    }
    setIsReordering(checked); // Update reordering state
  };
  // Determine background and text colors based on user preferences
  const bgColor = user.color ?? "#ffffff"; // Default background color
  const textColor = getReadableTextColor(bgColor); // Get readable text color based on background

  const columnStyle = user.color
    ? {
        backgroundColor: bgColor,
        color: textColor,
      }
    : undefined;

  // Calculate accent colors based on text color
  const accentColor =
    textColor === "#000000"
      ? shade(bgColor, -40) // Darker shade for light text
      : shade(bgColor, 40); // Lighter shade for dark text

  const accentColorIntense =
    textColor === "#000000"
      ? shade(bgColor, -60) // More intense darker shade for light text
      : shade(bgColor, 60); // More intense lighter shade for dark text

  return (
    <div
      className={cn(
        "bg-foreground/20 max-w-96 p-5 mx-auto rounded-xl flex flex-col ",
        className
      )}
      style={columnStyle}
    >
      {/* TaskProgress */}
      <TaskProgress
        total={tasks.length}
        user={user}
        accentColor={accentColorIntense}
        completed={tasks.length - notCompleted.length}
        className="mb-5"
      />
      {/* Admin switch */}
      {isAdmin() && (
        <div
          className="flex items-center justify-between mb-5"
          style={{ "--track": accentColorIntense ?? "#99a1af" }}
        >
          <span className="font-medium">Sortera</span>
          <Switch
            checked={isReordering}
            onCheckedChange={handleCheckChange}
            className="data-[state=unchecked]:bg-[color:var(--track)] dark:data-[state=unchecked]:bg-[color:var(--track)] broder border-[color:var(--track)]"
          />
        </div>
      )}
      <div className="flex-1">
        {isReordering ? (
          <TaskReorder
            tasks={localTasks}
            accentColor={accentColor}
            setTasks={setLocalTasks}
            movedTasks={movedTasks}
          />
        ) : (
          <TaskList
            tasks={notCompleted}
            accentColor={accentColor}
            handleComplete={handleComplete}
          />
        )}
      </div>
      {/* admin? Add btn */}
      {isAdmin() && (
        <div className="flex items-center justify-center mt-6">
          <Button
            asChild
            variant="icon"
            className="border-4 border-primary rounded-full p-2 size-12 hover:bg-[color:var(--track)] hover:text-secondary transition-colors"
            style={{
              borderColor: accentColorIntense,
              color: textColor,
              "--track": accentColor,
            }}
          >
            <Link
              href={`/add?date=${format(date, "yyyy-MM-dd")}&userId=${
                user.uid
              }`}
              aria-label="Shortcut - Lägg till uppgift"
            >
              <PlusIcon className="size-10" />
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
};
