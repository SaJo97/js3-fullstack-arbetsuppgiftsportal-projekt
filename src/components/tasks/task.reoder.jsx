"use client";
import { GripVerticalIcon } from "lucide-react";
import { Reorder } from "motion/react";
import { useState } from "react";

export const TaskReorder = ({ tasks, setTasks, movedTasks, accentColor }) => {
  const [active, setActive] = useState(null); // State to track the currently active (dragged) task
  // Function to handle reordering of tasks
  const handleReorder = (list) => {
    const activeTask = list.find((t) => t.id === active); // Find the currently active task
    // console.log({activeTask})
    const activeIndex = list.findIndex((t) => t.id === active); // Get the index of the active task

    // Get the order values of the previous and next tasks
    const prev = list[activeIndex - 1]?.order; // Order of the previous task
    const next = list[activeIndex + 1]?.order; // Order of the next task

    // Calculate the new order for the active task
    const newOrder = getSparseOrder(prev, next);

    // Check if the active task has already been moved
    if (movedTasks.current.find((t) => t.id === activeTask.id)) {
      const index = movedTasks.current.findIndex((t) => t.id === activeTask.id); // Find its index in movedTasks
      movedTasks.current[index].newOrder = newOrder; // Update the new order
    } else {
      movedTasks.current.push({ id: activeTask.id, newOrder }); // Add the task to movedTasks with its new order
    }

    setTasks(list);
  };

  // console.log(movedTasks)
  // Function to calculate a sparse order value between two existing order values
  const getSparseOrder = (prev, next) => {
    if (prev === undefined) return next - 1000; // If no previous order, place before the next task
    if (next === undefined) return prev + 1000; // If no next order, place after the previous task

    // Calculate a new order value that is halfway between prev and next
    return prev + Math.floor((next - prev) / 2);
  };

  return (
    <Reorder.Group
      axis="y" // Allow vertical draggin
      as="ul"
      values={tasks}
      onReorder={handleReorder}
      className="space-y-3 w-full"
    >
      {tasks.map((task) => (
        <Reorder.Item
          as="li"
          key={task.id}
          onDragStart={() => setActive(task.id)}
          onDragEnd={() => setActive(null)}
          value={task}
          className="flex items-center gap-3 p-4 shadow-sm bg-background rounded-lg cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          <GripVerticalIcon className="size-5" />
          <span className="text-xl font-medium">{task.title}</span>
        </Reorder.Item>
      ))}
    </Reorder.Group>
  );
};
