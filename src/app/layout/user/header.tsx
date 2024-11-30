import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  IconButton,
  Avatar,
  Popover,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LogoutIcon from "@mui/icons-material/Logout";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { UserProps } from "@/utils/interface/UserInterface";

const Header = () => {
  const [avtUrl, setAvtUrl] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();

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
      <div className="flex items-center gap-4 pr-10 relative">
        <PopupState variant="popover" popupId="avatar-popup-popover">
          {(popupState) => (
            <>
              {/* Avatar trigger */}
              <Avatar
                className="w-8 h-8"
                alt="User Avatar"
                src={`http://localhost:9000/uploads/${avtUrl}`}
                {...bindTrigger(popupState)}
                style={{ cursor: "pointer" }}
              />
              {/* Popover */}
              <Popover
                {...bindPopover(popupState)}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "center",
                }}
                transformOrigin={{
                  vertical: "top",
                  horizontal: "center",
                }}
              >
                <div style={{ position: "relative" }}>
                  <List>
                    <ListItemButton
                      sx={{ py: 1 }}
                      onClick={() => {
                        popupState.close();
                        router.push("/info/profile");
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "32px" }}>
                        <AccountCircleIcon />
                      </ListItemIcon>
                      <ListItemText primary="Hồ sơ cá nhân" />
                    </ListItemButton>
                    <ListItemButton
                      sx={{ py: 1 }}
                      onClick={() => {
                        popupState.close();
                        router.push("/info/trips");
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "32px" }}>
                        <DescriptionIcon />
                      </ListItemIcon>
                      <ListItemText primary="Đơn hàng của tôi" />
                    </ListItemButton>
                    <ListItemButton
                      sx={{ py: 1 }}
                      onClick={() => {
                        popupState.close();
                        localStorage.clear();
                        router.push("/login");
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: "32px" }}>
                        <LogoutIcon />
                      </ListItemIcon>
                      <ListItemText primary="Đăng xuất" />
                    </ListItemButton>
                  </List>
                </div>
              </Popover>
            </>
          )}
        </PopupState>
        <IconButton
          className="py-0"
          color="inherit"
          style={{ fontSize: "1.75rem" }}
        >
          <ShoppingCartIcon fontSize="inherit" />
        </IconButton>
      </div>
    </div>
  );
};

export default Header;
