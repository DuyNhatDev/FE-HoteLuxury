"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import apiService from "@/services/api";

interface Data {
  data: string;
  message: string;
  status: string;
}

const HomeHeader = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avtUrl, setAvtUrl] = useState<string>("");
  const router = useRouter();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push("/login");
  };
  useEffect(() => {
    const fetchAvt = async () => {
      try {
        const response = await apiService.get<Data>("/admin/avatar");
        if (response.data && response.data.data) {
          setAvtUrl(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvt();
  }, []);

  return (
    <div className="sticky top-0 z-50 flex justify-between items-center shadow-md py-3 px-40 bg-blue-900 text-white mx-auto">
      <h1
        className="text-xl font-semibold pl-3"
        onClick={() => {
          router.push("/home");
        }}
      >
        HoteLuxury
      </h1>
      <div className="flex items-center gap-4 pr-10">
        <Avatar
          className="w-8 h-8"
          alt="User Avatar"
          src={avtUrl}
          onClick={handleAvatarClick}
          style={{ cursor: "pointer" }}
        />
        <IconButton
          className="py-0"
          color="inherit"
          style={{ fontSize: "1.75rem" }}
        >
          <ShoppingCartIcon fontSize="inherit" />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          MenuListProps={{
            autoFocusItem: false,
          }}
        >
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Profile" />
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <SettingsIcon />
            </ListItemIcon>
            <ListItemText primary="Setting" />
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default HomeHeader;
