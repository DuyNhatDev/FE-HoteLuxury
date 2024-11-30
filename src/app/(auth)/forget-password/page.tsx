"use client"
import React from 'react'
import { useRouter } from 'next/navigation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { IconButton } from '@mui/material';
import ForgetPassWordForm from '@/app/(auth)/forget-password/components/ForgetPasswordForm';
const ForgetPasswordPage = () => {
    const router = useRouter();
    const handleBackClick = () => {
    router.push('http://localhost:3000/login');
  };
  return (
    <div className="h-screen max-h-[93vh] overflow-hidden flex items-center justify-center bg-gray-200">
      <div className="bg-white shadow-lg rounded-lg py-7 px-7 w-full max-w-md border border-gray-300">
        <div className="flex items-center justify-between mb-6">
          <IconButton onClick={handleBackClick}>
            <ArrowBackIcon />
          </IconButton>
          <h2 className="text-3xl font-bold text-blue-900 text-center flex-grow">
            Quên mật khẩu
          </h2>
          <div className="w-10"></div>
        </div>
        <ForgetPassWordForm />
      </div>
    </div>
  );
}
export default ForgetPasswordPage;
