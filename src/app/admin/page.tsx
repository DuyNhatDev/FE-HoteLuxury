import DashBoard from '@/app/admin/components/DashBoard'
import { Box } from '@mui/material'
import React from 'react'

const AdminPage = () => {
  return (
      <Box sx={{ display: 'flex' }}>
            <DashBoard/>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
                <h1>Admin Page</h1>
            </Box>
        </Box>
  )
}

export default AdminPage
