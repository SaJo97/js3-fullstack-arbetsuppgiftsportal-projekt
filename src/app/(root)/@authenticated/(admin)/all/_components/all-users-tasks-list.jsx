"use client";

import { TaskColumn } from "@/components/tasks/task-column";
import { useUsers } from "@/context/usersContext";
import { isValid, parse } from "date-fns";
import { useSearchParams } from "next/navigation";

export const AllUsersTasksList = () => {
  const searchParams = useSearchParams();
  const date = searchParams.get("date");
  const parsed = date ? parse(date, "yyyy-MM-dd", new Date()) : new Date();
  const selectedDate = isValid(parsed) ? parsed : new Date();

  const { users } = useUsers();
  return (
    <>
      {
        // Check if there are users; if so, map over the users to render a TaskColumn for each
        !!users.length &&
          users.map((user) => {
            return (
              <TaskColumn
                key={user.uid}
                date={selectedDate}
                user={user}
                className="w-72"
              />
            );
          })
      }
    </>
  );
};
