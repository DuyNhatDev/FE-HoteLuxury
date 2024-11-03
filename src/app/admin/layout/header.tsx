'use client';
import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { IconButton, Avatar, Menu, MenuItem, ListItemIcon, ListItemText } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import avatar from "@/app/admin/assets/images/anhmeo.png";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';


const Header = () => {
  const pathname = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleAvatarClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = 'http://localhost:3000/login'
  };
  const getTitle = (pathname: string) => {
    if (pathname === '/admin/dashboard') {
      return 'Dashboard';
    } else if (pathname === '/admin/user') {
      return 'User Management';
    } else if (pathname === '/admin/hotel') {
      return 'Hotel Management';
    } else if (pathname === '/admin/room') {
      return 'Room Management';
    }
    return 'Admin Panel';
  };

  return (
    <div className="flex justify-between items-center mb-1 shadow-md p-2 rounded-lg mx-auto">
      <h1 className="text-xl font-semibold pl-3">{getTitle(pathname)}</h1>
      <div className="flex items-center gap-4 pr-10">
        <IconButton className="py-0" color="inherit" style={{ fontSize: '1.75rem' }}>
          <NotificationsIcon fontSize="inherit" />
        </IconButton>
        <Avatar className="w-8 h-8" alt="User Avatar" src={avatar.src} onClick={handleAvatarClick} style={{ cursor: 'pointer' }} />
        <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'center',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'center',
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
