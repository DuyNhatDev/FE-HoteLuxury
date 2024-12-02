import DashBoard from "@/app/hotel-manager/components/DashBoard";
import { Box } from "@mui/material";
import React from "react";

const HotelPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <DashBoard />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <h1>Hotel Page</h1>
      </Box>
    </Box>
  );
};

export default HotelPage;