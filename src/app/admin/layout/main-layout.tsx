import React, { ReactNode } from "react";
import Box from "@mui/material/Box";
import MenuDrawer from "@/app/admin/components/DashBoard";
import Header from "@/app/admin/layout/header";

interface AdminLayoutProps {
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
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

export default AdminLayout;