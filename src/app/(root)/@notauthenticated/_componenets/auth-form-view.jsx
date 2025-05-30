"use client";

import { useState } from "react";
import { LoginForm, loginFormSchema } from "./login-form";
import { RegisterForm, registerFormSchema } from "./register-form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

export const AuthFormView = () => {
  const [showLogin, setShowLogin] = useState(true);
  // Function to change the displayed form based on the form name
  const changeForm = (formName) => {
    if (formName === "login") {
      setShowLogin(true);
    } else if (formName === "register") {
      setShowLogin(false);
    }
  };
  // Initializing the login form with validation schema and default values
  const loginForm = useForm({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  // Initializing the register form with validation schema and default values
  const registerForm = useForm({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      email: "",
      password: "",
      displayName: "",
      confirmPassword: "",
    },
  });

  return (
    <div className="border not-dark:border-gray-300 max-w-2xl mx-auto p-4 rounded-2xl">
      {showLogin ? ( // Conditional rendering based on the showLogin stat
        <LoginForm changeForm={changeForm} form={loginForm} />
      ) : (
        <RegisterForm changeForm={changeForm} form={registerForm} />
      )}
    </div>
  );
};
