import { AuthProvider } from "@/context/authContext";
import { ThemeProvider } from "./theme-provider";
import { UsersProvider } from "@/context/usersContext";
import { TasksProvider } from "@/context/tasksContext";
import { ConfettiProvider } from "@/context/confettiContex";

const Providers = ({ children }) => {
  return (
    <AuthProvider>
      <UsersProvider>
        <TasksProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <ConfettiProvider>{children}</ConfettiProvider>
          </ThemeProvider>
        </TasksProvider>
      </UsersProvider>
    </AuthProvider>
  );
};
export default Providers;
