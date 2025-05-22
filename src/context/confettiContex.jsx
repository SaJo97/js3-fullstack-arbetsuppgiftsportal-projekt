"use client";

import ReactConfetti from "react-confetti";

const { createContext, useContext, useState, useEffect } = require("react");

const ConfettiContex = createContext();

export const ConfettiProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  const showConfetti = () => {
    setIsOpen(true);
  };
  // Effect to update dimensions on window resize
  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({ width: window.innerWidth, height: window.innerHeight }); // Update dimensions state with current window size
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions); // Add event listener to update dimensions on resize
    return () => window.removeEventListener("resize", updateDimensions); // Cleanup the event listener on component unmount
  }, []);
  // Value to be provided to the context
  const value = {
    showConfetti,
  };

  return (
    <ConfettiContex.Provider value={value}>
      {isOpen && (
        <ReactConfetti
          className="pointer-events-none z-50"
          numberOfPieces={500}
          recycle={false}
          width={dimensions.width}
          height={dimensions.height}
          onConfettiComplete={() => setIsOpen(false)}
        />
      )}
      {children}
    </ConfettiContex.Provider>
  );
};

export const useConfetti = () => {
  const context = useContext(ConfettiContex);
  if (!context) {
    throw new Error("useConfetti must be used within an ConfettiProviders");
  }
  return context;
};
