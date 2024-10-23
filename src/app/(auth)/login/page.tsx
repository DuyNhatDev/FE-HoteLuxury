import React from 'react'
import LoginForm from './components/LoginForm'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
const LoginPage = () => {
  return (
      <div className="min-h-screen flex items-center justify-center bg-gray-200">
        <div className="bg-white shadow-lg rounded-lg py-7 px-7 w-full max-w-md border border-gray-300">
          <div className="flex items-center justify-between mb-6">
            <IconButton>
              <ArrowBackIcon />
            </IconButton>
            <h2 className="text-3xl font-bold text-blue-900 text-center flex-grow">
              Đăng nhập
            </h2>
            <div className="w-10"></div>
          </div>
            <LoginForm/>
        </div>
      </div>
  )
}
export default LoginPage;
