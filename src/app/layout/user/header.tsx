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
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { UserProps } from "@/utils/interface/UserInterface";

interface Data {
  data: string;
  message: string;
  status: string;
}

const Header = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avtUrl, setAvtUrl] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

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
    if (pathname === "/home" || pathname === "/login") {
      const fetchAvt = async () => {
        try {
          const id = localStorage.getItem("userId");
          if (!id) {
            setAvtUrl("");
            return;
          }
          const resp = await apiService.get<ApiResponse<UserProps>>(
            `user/${id}`
          );
          if (resp.data.data.image) {
            setAvtUrl(resp.data.data.image);
          }
        } catch (error) {
          console.error("Error fetching avatar:", error);
        }
      };

      fetchAvt();
    }
  }, [pathname]);

  return (
    <div className="fixed top-0 left-0 w-full z-50 flex justify-between items-center shadow-md py-3 px-40 bg-blue-900 text-white">
      <h1
        className="text-xl font-semibold pl-3 cursor-pointer text-orange-400 hover:text-orange-500 hover:underline"
        onClick={() => {
          sessionStorage.clear();
          router.push("/home");
        }}
      >
        HoteLuxury
      </h1>
      <div className="flex items-center gap-4 pr-10">
        <Avatar
          className="w-8 h-8"
          alt="User Avatar"
          src={`http://localhost:9000/uploads/${avtUrl}`}
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

export default Header;
