import React from 'react'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import RegisterForm from '@/app/(auth)/signup/components/SignUpForm';
const SignUpPage = () => {
  return (
    <div className="h-screen max-h-[93vh] overflow-hidden flex items-center justify-center bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg py-7 px-7 w-full max-w-md border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
          <h2 className="text-3xl font-bold text-blue-900 text-center flex-grow">
            Đăng ký
          </h2>
          <div className="w-10"></div>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}
export default SignUpPage;
