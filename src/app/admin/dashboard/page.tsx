import React from 'react';
import Box from '@mui/material/Box';
import MenuDrawer from '@/app/admin/components/DashBoard';
const AdminDashboard = () => {
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
            <h1>DashBoard</h1>
            </Box>
        </Box>
    )
}
export default AdminDashboard;