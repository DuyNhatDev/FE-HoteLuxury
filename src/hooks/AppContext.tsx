"use client";

import React, { createContext, useContext, useState } from "react";

interface AppState {
  locationId: number | null;
  setLocationId: React.Dispatch<React.SetStateAction<number | null>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locationId, setLocationId] = useState<number | null>(null);

  return (
    <AppContext.Provider value={{ locationId, setLocationId }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
