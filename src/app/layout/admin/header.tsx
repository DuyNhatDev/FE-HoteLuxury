import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import MenuDrawer from "@/app/admin/components/DashBoard";
import Header from "@/app/admin/components/header";

interface AdminHeaderProps {
  children: ReactNode;
}
const AdminHeader: React.FC<AdminHeaderProps> = ({ children }) => {
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

export default AdminHeader;
