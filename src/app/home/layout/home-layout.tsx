import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import HomeHeader from "@/app/home/layout/header";

interface HomeLayoutProps {
  children: ReactNode;
}

const HomeLayout: React.FC<HomeLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          height: "100%",
          overflow: "auto",
        }}
      >
        <HomeHeader />
        {children}
      </Box>
    </Box>
  );
};

export default HomeLayout;
