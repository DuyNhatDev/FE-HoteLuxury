import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Avatar,
  Popover,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Button,
} from "@mui/material";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PopupState, { bindTrigger, bindPopover } from "material-ui-popup-state";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { UserProps } from "@/utils/interface/UserInterface";

const Header = () => {
  const [avtUrl, setAvtUrl] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  useEffect(() => {
    // Chỉ chạy trên client
    if (typeof window !== "undefined") {
      const authData = localStorage.getItem("authData");
      setIsAuthenticated(!!authData);

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
          if (resp.data.data.fullname) {
            setFullName(resp.data.data.fullname);
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
              <Avatar
                className="w-8 h-8"
                alt="User Avatar"
                src={
                  avtUrl
                    ? `http://localhost:9000/uploads/${avtUrl}`
                    : "/images/no-avatar.png"
                }
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
                <div
                  style={{
                    position: "relative",
                    padding: "8px",
                    width: "220px",
                  }}
                >
                  {isAuthenticated ? (
                    <List sx={{ padding: 0 }}>
                      <ListItemButton
                        sx={{
                          py: 0.5,
                          minHeight: "36px",
                        }}
                        onClick={() => {
                          popupState.close();
                          router.push("/info/profile");
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: "32px" }}>
                          <AccountCircleIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Hồ sơ cá nhân"
                          primaryTypographyProps={{ fontSize: "14px" }}
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{
                          py: 0.5,
                          minHeight: "36px",
                        }}
                        onClick={() => {
                          popupState.close();
                          router.push("/info/trips");
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: "32px" }}>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Đơn hàng của tôi"
                          primaryTypographyProps={{ fontSize: "14px" }}
                        />
                      </ListItemButton>
                      <ListItemButton
                        sx={{
                          py: 0.5,
                          minHeight: "36px",
                        }}
                        onClick={() => {
                          popupState.close();
                          localStorage.clear();
                          setFullName("");
                          setAvtUrl("");
                          setIsAuthenticated(false);
                          //router.push("/login");
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: "32px" }}>
                          <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary="Đăng xuất"
                          primaryTypographyProps={{ fontSize: "14px" }}
                        />
                      </ListItemButton>
                    </List>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Button
                        className="!bg-blue-500 !text-white w-full px-4 py-2 !rounded hover:bg-blue-600 mb-2"
                        onClick={() => {
                          popupState.close();
                          router.push("/sign-up");
                        }}
                      >
                        Đăng ký
                      </Button>
                      <p className="text-sm text-center">
                        Quý khách đã có tài khoản?
                        <span
                          className="text-blue-500 cursor-pointer hover:underline"
                          onClick={() => {
                            popupState.close();
                            router.push("/login");
                          }}
                        >
                          Đăng nhập ngay
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </Popover>
            </>
          )}
        </PopupState>

        <span className="text-sm font-medium text-white">
          {fullName ? fullName : ""}
        </span>
      </div>
    </div>
  );
};

export default Header;
