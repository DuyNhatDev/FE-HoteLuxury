import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import MenuDrawer from "@/app/hotel-management/components/DashBoard";
import Header from "@/app/hotel-management/layout/header";

interface HotelLayoutProps {
  children: ReactNode;
}

const HotelLayout: React.FC<HotelLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <MenuDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <Header />
        {children}
      </Box>
    </Box>
  );
};

export default HotelLayout;
