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
import HomeIcon from "@mui/icons-material/Home";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { UserProps } from "@/utils/interface/UserInterface";
import { googleLogout } from "@react-oauth/google";

const Header = () => {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [avtUrl, setAvtUrl] = useState<string>("");
  const router = useRouter();

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  useEffect(() => {
    const fetchAvt = async () => {
      try {
        const id = localStorage.getItem("userId");
        const resp = await apiService.get<ApiResponse<UserProps>>(`user/${id}`);
        if (resp.data.data.image) setAvtUrl(resp.data.data.image);
      } catch (error) {
        console.error("Error fetching avatar:", error);
      }
    };
    fetchAvt();
  }, []);

  const getTitle = (pathname: string) => {
    if (pathname.includes("/hotel-manager/dashboard")) {
      return "Dashboard";
    } else if (pathname.includes("/hotel-manager/hotel")) {
      return "Quản lý Khách sạn của tôi";
    } else if (pathname.includes("/hotel-manager/room-type")) {
      return "Quản lý Loại phòng";
    } else if (pathname.includes("/hotel-manager/room")) {
      return "Quản lý Phòng";
    } else if (pathname.includes("/hotel-manager/order")) {
      return "Quản lý Đơn đặt phòng";
    } else if (pathname.includes("/hotel-manager/profile")) {
      return "Thông tin tài khoản";
    } else if (pathname.includes("/hotel-manager/change-password")) {
      return "Đổi mật khẩu";
    }
    return "Hotel Panel";
  };

  return (
    <div className="flex justify-between items-center mb-1 shadow-md p-2 rounded-lg mx-auto">
      <h1 className="text-xl font-semibold pl-3">{getTitle(pathname)}</h1>
      <div className="flex items-center gap-4 mr-20">
        {/* <IconButton
          className="py-0"
          color="inherit"
          style={{ fontSize: "1.75rem" }}
        >
          <NotificationsIcon fontSize="inherit" />
        </IconButton> */}
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
          onClose={() => {
            setAnchorEl(null);
          }}
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
          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              googleLogout();
              router.push("/home");
            }}
          >
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Trang chủ" />
          </MenuItem>

          <MenuItem
            onClick={() => {
              setAnchorEl(null);
              router.push("/hotel-manager/profile");
            }}
          >
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="Hồ sơ" />
          </MenuItem>

          <MenuItem
            onClick={() => {
              localStorage.clear();
              router.push("/login");
            }}
          >
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Đăng xuất" />
          </MenuItem>
        </Menu>
      </div>
    </div>
  );
};

export default Header;
