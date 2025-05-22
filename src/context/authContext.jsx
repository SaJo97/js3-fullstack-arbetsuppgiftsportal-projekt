"use client";

import { auth, db } from "@/lib/firebase";
import {
  createUserWithEmailAndPassword,
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  signOut,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import {
  doc,
  getDoc,
  onSnapshot,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

const {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} = require("react");

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [authLoaded, setAuthLoaded] = useState(false);

  const router = useRouter();
  console.log(user);
  // Effect to listen for authentication state changes
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      // Creates an observer to listen for login/logout changes
      if (!firebaseUser) {
        setUser(null);
        setAuthLoaded(true);
        return;
      }

      const docRef = doc(db, "users", firebaseUser.uid); // Reference to the user's document in Firestore
      // Function to get user document with retry logic
      const getUserDocWithRetry = async (retries = 5, delay = 300) => {
        let docSnap = null;
        for (let i = 0; i < retries; i++) {
          docSnap = await getDoc(docRef); // Attempt to get the user document
          if (docSnap.exists()) break;

          await new Promise((resolve) => setTimeout(resolve, delay)); // Wait before retrying
        }

        return docSnap;
      };

      const docSnap = await getUserDocWithRetry(); // Get the user document with retries

      if (docSnap && docSnap.exists()) {
        setUser(docSnap.data()); // Set user state with document data
      } else {
        console.warn("Användardokument kunde inte hämtas");
        setUser(null);
      }

      setAuthLoaded(true);
    });

    return () => unsub(); // Cleanup the observer on component unmount
  }, []);

  const register = async (email, password, displayName) => {
    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(res.user, { displayName });

      if (!res.user) {
        console.log("no user");
        return;
      }
      // Set user document in Firestore
      await setDoc(doc(db, "users", res.user.uid), {
        uid: res.user.uid,
        email: res.user.email,
        displayName: res.user.displayName,
        role: "user",
        createdAt: Timestamp.now(),
        color: "#9dedcc",
      });
    } catch (error) {
      console.log("Error registrering the user: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Function to log out the user
  const logout = async () => {
    router.replace("/");
    await signOut(auth);
  };
  // Function to log in the user
  const login = async (email, password) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log("Error signing in: ", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Function to check if the user is an admin
  const isAdmin = () => {
    if (!user) return false;
    return user.role === "admin";
  };
  // Function to update user data
  const updateUser = async (user, newUserData) => {
    setLoading(true);
    const toastId = toast.loading("Laddar...");
    try {
      const userRef = doc(db, "users", user.uid); // Reference to the user's document
      await updateDoc(userRef, newUserData); // Update user document with new data
      setUser((prevUser) => ({ ...prevUser, ...newUserData })); // Update user state with new data
      toast.success("profilen uppdaterad", { id: toastId });
    } catch (error) {
      toast.error("Någonting gick fel, försök igen", { id: toastId });
      console.error("Error updating the user: ", error);
    } finally {
      setLoading(false);
    }
  };
  // Function to change user password
  const changePassword = async (oldPassword, newPassword) => {
    setLoading(true);
    const toastId = toast.loading("Laddar...");
    const user = auth.currentUser;

    if (!user) {
      console.error("Ingen användare är inloggad");
      toast.error("Ingen användare är inloggad", { id: toastId });
      return;
    }
    try {
      // Reauthenticate user with old password
      const userCredential = await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(user.email, oldPassword)
      );
      await updatePassword(userCredential.user, newPassword); // Update password
      toast.success("Lösenorder har uppdaterats", { id: toastId });
    } catch (error) {
      console.error("Error reauthenticating user: ", error);
      // Handle specific error codes
      if (error.code === "auth/invalid/credential") {
        toast.error("Felaktigt lösenord", { id: toastId });
      } else if (error.code === "auth/weak-password") {
        toast.error("Lösenordet är för svagt", { id: toastId });
      } else {
        toast.error("Någonting gick fel, försök igen", { id: toastId });
      }
      throw error;
    } finally {
      setLoading(false);
    }
  };
  // Ref to store the previous user role
  const previousRole = useRef(null);
  // Effect to listen for changes in user role
  useEffect(() => {
    if (!user?.uid) return;
    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
      // Listen for changes to the user document
      if (!docSnapshot.exists()) return;
      const data = docSnapshot.data();
      if (!data.role) return;
      if (previousRole.current && previousRole.current !== data.role) {
        // Role changed, reload page
        window.location.reload();
      }
      previousRole.current = data.role; // Update previous role
    });
    return () => unsubscribe(); // Cleanup the listener on component unmount
  }, [user]);
  // Value to be provided to the context
  const value = {
    user,
    setUser,
    loading,
    authLoaded,
    register,
    logout,
    login,
    isAdmin,
    updateUser,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
// Custom hook to use the AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
};
