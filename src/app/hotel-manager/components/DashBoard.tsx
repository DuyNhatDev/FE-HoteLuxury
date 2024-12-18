"use client";
import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import { Menu, Dashboard, Bed, Category } from "@mui/icons-material";
import Image from "next/image";
import { ListItemButton } from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import { Drawer, DrawerHeader } from "@/app/admin/styles/drawer-style";
import { FaHotel } from "react-icons/fa6";

export default function MenuDrawer() {
  const [openDrawer, setOpenDrawer] = useState<boolean>(true);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  const handleToggleDrawer = () => {
    setOpenDrawer(!openDrawer);
  };

  const handleListItemClick = (index: number, path: string) => {
    setSelectedIndex(index);
    router.push(path);
  };

  useEffect(() => {
    switch (pathname) {
      case "/hotel-manager/dashboard":
        setSelectedIndex(0);
        break;
      case "/hotel-manager/hotel":
        setSelectedIndex(1);
        break;
      case "/hotel-manager/room-type":
        setSelectedIndex(2);
        break;
      case "/hotel-manager/room":
        setSelectedIndex(3);
        break;
      case "/hotel-manager/order":
        setSelectedIndex(4);
        break;
      default:
        setSelectedIndex(null);
    }
  }, [pathname]);

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <div className="h-screen flex flex-col">
        <Drawer
          variant="permanent"
          open={openDrawer}
          classes={{
            paper: "bg-gray-600 text-white flex flex-col justify-between",
          }}
        >
          <div>
            <DrawerHeader className="border-b-2 border-white">
              <div className="flex items-center justify-between w-full px-0 py-5">
                {openDrawer && (
                  <div className="flex items-center justify-center w-full">
                    <Image
                      src="/icons/admin-icon.png"
                      alt="Logo"
                      width={50}
                      height={50}
                    />
                    <div className="flex flex-col items-center ml-2">
                      <h2 className="text-xl font-semibold text-center">
                        Quản lý <br /> Khách sạn
                      </h2>
                    </div>
                  </div>
                )}
                <IconButton
                  className="text-white"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleToggleDrawer();
                  }}
                  sx={{
                    pl: openDrawer ? 3 : 0.5,
                  }}
                >
                  <Menu style={{ fontSize: "30px" }} />
                </IconButton>
              </div>
            </DrawerHeader>

            <Divider />
            <List component="div" disablePadding>
              <ListItemButton
                onClick={() =>
                  handleListItemClick(0, "/hotel-manager/dashboard")
                }
                className={`${
                  selectedIndex === 0 ? "bg-gray-400" : ""
                } hover:bg-gray-500`}
                sx={{
                  pl: openDrawer ? 3 : 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 50,
                }}
              >
                <ListItemIcon className="text-white">
                  <Dashboard fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary="Dashboard"
                  primaryTypographyProps={{ fontSize: "1rem" }}
                />
              </ListItemButton>

              <ListItemButton
                onClick={() => handleListItemClick(1, "/hotel-manager/hotel")}
                className={`${
                  selectedIndex === 1 ? "bg-gray-400" : ""
                } hover:bg-gray-500`}
                sx={{
                  pl: openDrawer ? 3 : 1.5,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 50,
                }}
              >
                <ListItemIcon className="text-white">
                  <FaHotel fontSize="medium" />
                </ListItemIcon>
                <ListItemText
                  primary="Khách sạn"
                  primaryTypographyProps={{ fontSize: "1rem" }}
                />
              </ListItemButton>

              <ListItemButton
                onClick={() =>
                  handleListItemClick(2, "/hotel-manager/room-type")
                }
                className={`${
                  selectedIndex === 2 ? "bg-gray-400" : ""
                } hover:bg-gray-500`}
                sx={{
                  pl: openDrawer ? 3 : 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 50,
                }}
              >
                <ListItemIcon className="text-white">
                  <Category style={{ fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Loại phòng"
                  primaryTypographyProps={{ fontSize: "1rem" }}
                />
              </ListItemButton>
              <ListItemButton
                onClick={() => handleListItemClick(3, "/hotel-manager/room")}
                className={`${
                  selectedIndex === 3 ? "bg-gray-400" : ""
                } hover:bg-gray-500`}
                sx={{
                  pl: openDrawer ? 3 : 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 50,
                }}
              >
                <ListItemIcon className="text-white">
                  <Bed style={{ fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Phòng"
                  primaryTypographyProps={{ fontSize: "1rem" }}
                />
              </ListItemButton>

              <ListItemButton
                onClick={() => handleListItemClick(4, "/hotel-manager/order")}
                className={`${
                  selectedIndex === 4 ? "bg-gray-400" : ""
                } hover:bg-gray-500`}
                sx={{
                  pl: openDrawer ? 3 : 2,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  minHeight: 50,
                }}
              >
                <ListItemIcon className="text-white">
                  <FactCheckIcon style={{ fontSize: 24 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Đơn đặt phòng"
                  primaryTypographyProps={{ fontSize: "1rem" }}
                />
              </ListItemButton>
            </List>
            <Divider />
          </div>
        </Drawer>
      </div>
    </Box>
  );
}
