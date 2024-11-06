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
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import apiService from "@/services/api";

interface Data {
  data: string;
  message: string;
  status: string;
}

const Header = () => {
  const pathname = usePathname();
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
        const response = await apiService.get<Data>(
          "/admin/avatar"
        );
        console.log(response.data.data);
        if (response.data && response.data.data) {
          console.log(response.data.data);
          setAvtUrl(response.data.data);
        }
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvt();
  }, []);

useEffect(() => {
  console.log(avtUrl);
}, [avtUrl]);  

  const getTitle = (pathname: string) => {
    if (pathname.includes("/admin/dashboard")) {
      return "Dashboard";
    } else if (pathname.includes("/admin/user")) {
      return "User Management";
    } else if (pathname.includes("/admin/hotel")) {
      return "Hotel Management";
    } else if (pathname.includes("/admin/room")) {
      return "Room Management";
    }
    return "Admin Panel";
  };

  return (
    <div className="flex justify-between items-center mb-1 shadow-md p-2 rounded-lg mx-auto">
      <h1 className="text-xl font-semibold pl-3">{getTitle(pathname)}</h1>
      <div className="flex items-center gap-4 pr-10">
        <IconButton
          className="py-0"
          color="inherit"
          style={{ fontSize: "1.75rem" }}
        >
          <NotificationsIcon fontSize="inherit" />
        </IconButton>
        <Avatar
          className="w-8 h-8"
          alt="User Avatar"
          src={avtUrl}
          onClick={handleAvatarClick}
          style={{ cursor: "pointer" }}
        />
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
