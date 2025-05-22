"use client";

import {
  collection,
  doc,
  onSnapshot,
  query,
  updateDoc,
} from "firebase/firestore";
import { useAuth } from "./authContext";
import { db } from "@/lib/firebase";
import toast from "react-hot-toast";

const { createContext, useContext, useState, useEffect } = require("react");

const UsersContext = createContext();

export const UsersProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const { isAdmin } = useAuth();
  // useEffect to fetch users from Firestore when the user is an admin
  useEffect(() => {
    if (!isAdmin()) return;

    const q = query(collection(db, "users")); // Create a query to fetch users from the "users" collection
    const unsub = onSnapshot(q, (querySnapshot) => {
      const usersData = []; // Array to hold fetched user data
      // Iterate through each document in the snapshot
      querySnapshot.forEach((doc) => {
        usersData.push({ ...doc.data(), id: doc.id }); // Push user data along with document ID
      });
      setUsers(usersData); // Update users state with fetched data
    });

    return () => unsub(); // Cleanup subscription on component unmount
  }, [isAdmin]);
  // Function to change the role of a user
  const changeRole = async (uid, role) => {
    if (!isAdmin()) {
      toast.error("Du har inte behörighet att göra detta.");
      return;
    }
    if (role !== "admin" && role !== "user") {
      // Validate the role
      toast.error("Ogiltig roll angiven");
      return;
    }
    // Check if changing the role to "user" would leave no admins
    const numberOfAdmins = users.filter((user) => user.role === "admin").length;
    if (numberOfAdmins <= 1 && role === "user") {
      toast.error("Det måste alltid finnas minst en admin");
      return;
    }

    setLoading(true);
    try {
      const userRef = doc(db, "users", uid); // Get reference to the user document
      await updateDoc(userRef, { role }); // Update the user's role in Firestore
      toast.success(`Användaren har nu ${role}-behörighet`);
    } catch (error) {
      console.error("Error updating the user role", error);
      toast.error("Någonting gick fel, försök igen");
    } finally {
      setLoading(false);
    }
  };

  // Context value to be provided to components
  const value = {
    users,
    loading,
    changeRole,
  };

  return (
    <UsersContext.Provider value={value}>{children}</UsersContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UsersContext);
  if (!context) {
    throw new Error("useUsers must be used within an UsersProviders");
  }
  return context;
};
