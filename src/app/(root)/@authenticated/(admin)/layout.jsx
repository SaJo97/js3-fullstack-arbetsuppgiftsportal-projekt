"use client";

import { useAuth } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminLayout = ({ children }) => {
  const { isAdmin } = useAuth();
  const router = useRouter();
  // useEffect to run on component mount, redirect non-admin users to home page
  useEffect(() => {
    if (!isAdmin()) {
      router.replace("/");
    }
  }, []);
  // If user is not admin, render nothing (null) to prevent access to admin content
  if (!isAdmin()) {
    return null;
  }
  return <>{children}</>;
};
export default AdminLayout;
