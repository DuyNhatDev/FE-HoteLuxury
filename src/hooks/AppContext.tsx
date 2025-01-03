"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface Location {
  locationId: number | null;
  locationName: string | null;
}

interface DateRange {
  dayStart: string | null;
  dayEnd: string | null;
}

interface AppState {
  location: Location;
  setLocation: React.Dispatch<React.SetStateAction<Location>>;
  dateRange: DateRange;
  setDateRange: React.Dispatch<React.SetStateAction<DateRange>>;
  keyword: string | null;
  setKeyword: React.Dispatch<React.SetStateAction<string | null>>;
  hotelId: string | null;
  setHotelId: React.Dispatch<React.SetStateAction<string | null>>;
  roomTypeId: string | null;
  setRoomTypeId: React.Dispatch<React.SetStateAction<string | null>>;
  // userId: string | null;
  // setUserId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [location, setLocation] = useState<Location>(() => {
    if (typeof window !== "undefined") {
      const storedLocation = sessionStorage.getItem("location");
      return storedLocation
        ? JSON.parse(storedLocation)
        : { locationId: null, locationName: null };
    }
    return { locationId: null, locationName: null };
  });

  const [dateRange, setDateRange] = useState<DateRange>(() => {
    if (typeof window !== "undefined") {
      const storedDateRange = sessionStorage.getItem("dateRange");
      return storedDateRange
        ? JSON.parse(storedDateRange)
        : { dayStart: null, dayEnd: null };
    }
    return { dayStart: null, dayEnd: null };
  });

  const [keyword, setKeyword] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const storedKeyword = sessionStorage.getItem("keyword");
      return storedKeyword ? storedKeyword : null;
    }
    return null;
  });

  const [hotelId, setHotelId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const storedHotelId = sessionStorage.getItem("hotelId");
      return storedHotelId ? storedHotelId : null;
    }
    return null;
  });

  const [roomTypeId, setRoomTypeId] = useState<string | null>(() => {
    if (typeof window !== "undefined") {
      const storedRoomTypeId = sessionStorage.getItem("roomTypeId");
      return storedRoomTypeId ? storedRoomTypeId : null;
    }
    return null;
  });
  // const [userId, setUserId] = useState<string | null>(() => {
  //   if (typeof window !== "undefined") {
  //     const storedUserId = localStorage.getItem("userId");
  //     return storedUserId ? storedUserId : null;
  //   }
  //   return null;
  // });

  // useEffect(() => {
  //   if (userId !== null) {
  //     localStorage.setItem("userId", userId);
  //   } else {
  //     localStorage.removeItem("userId");
  //   }
  // }, [userId]);

  // useEffect(() => {
  //   const handleStorageChange = (event: StorageEvent) => {
  //     if (event.key === "userId") {
  //       if (!event.newValue) {
  //         setUserId(null);
  //       }
  //     }
  //   };

  //   window.addEventListener("storage", handleStorageChange);

  //   return () => {
  //     window.removeEventListener("storage", handleStorageChange);
  //   };
  // }, []);

  useEffect(() => {
    if (location?.locationId !== null && location?.locationName) {
      sessionStorage.setItem("location", JSON.stringify(location));
    } else {
      sessionStorage.removeItem("location");
    }
  }, [location]);

  useEffect(() => {
    if (dateRange?.dayStart && dateRange?.dayEnd) {
      sessionStorage.setItem("dateRange", JSON.stringify(dateRange));
    }
  }, [dateRange]);

  useEffect(() => {
    if (keyword !== null) {
      sessionStorage.setItem("keyword", keyword);
    } else {
      sessionStorage.removeItem("keyword");
    }
  }, [keyword]);

  useEffect(() => {
    if (hotelId !== null) {
      sessionStorage.setItem("hotelId", hotelId);
    }
  }, [hotelId]);

  useEffect(() => {
    if (roomTypeId !== null) {
      sessionStorage.setItem("roomTypeId", roomTypeId);
    }
  }, [roomTypeId]);

  return (
    <AppContext.Provider
      value={{
        location,
        setLocation,
        dateRange,
        setDateRange,
        keyword,
        setKeyword,
        hotelId,
        setHotelId,
        roomTypeId,
        setRoomTypeId,
        // userId,
        // setUserId,
      }}
    >
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
