"use client";

export const UserTasks = ({ tasks }) => {
  return (
    <ul className="flex flex-wrap gap-4 justify-center sm:justify-start">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="bg-foreground/20 p-4 rounded-xl shadow-md transition-all w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5"
        >
          <div className="p-4 bg-background rounded-lg flex flex-col justify-between h-full">
            <div className="flex-1 flex flex-col justify-between">
              <h3 className="font-bold text-lg">{task.title}</h3>
              <div className="text-sm text-muted-foreground">
                <p>Created: {task.createdAt?.toDate().toLocaleDateString()}</p>
                <p>Deadline: {task.deadline}</p>
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
