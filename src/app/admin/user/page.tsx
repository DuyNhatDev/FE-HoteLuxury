import React from 'react';
import Box from '@mui/material/Box';
import MenuDrawer from '@/app/admin/components/DashBoard';
import Header from '@/app/admin/layout/header';
import UserTable from '@/app/admin/user/components/UserManagement';
const AdminUser = () => {
    return (
        <Box sx={{ display: 'flex', height: '100vh' }}>
            <MenuDrawer />
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 0,
                    height: '100%',
                    overflow: 'hidden'
                }}
            >
            <Header/>
            <UserTable/>
            </Box>
        </Box>
    )
}
export default AdminUser;