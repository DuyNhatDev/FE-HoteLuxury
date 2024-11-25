"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Location {
  locationId: number | null;
  locationName: string | null;
}

interface AppState {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Lấy giá trị ban đầu từ sessionStorage
  const [location, setLocation] = useState<Location>(() => {
    if (typeof window !== "undefined") {
      const storedLocation = sessionStorage.getItem("location");
      return storedLocation
        ? JSON.parse(storedLocation)
        : { locationId: null, locationName: "" };
    }
    return { locationId: null, locationName: "" };
  });

  // Cập nhật sessionStorage khi location thay đổi
  useEffect(() => {
    if (location) {
      sessionStorage.setItem("location", JSON.stringify(location));
    }
  }, [location]);

  return (
    <AppContext.Provider value={{ location, setLocation }}>
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
