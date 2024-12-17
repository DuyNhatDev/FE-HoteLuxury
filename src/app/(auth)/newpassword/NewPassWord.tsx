"use client";
import apiService from "@/services/api";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface ApiResponse {
  message: string;
  status: string;
  email: string;
  newPassword: string;
}
const NewPassWord: React.FC = () => {
  const [newPassword, setNewPassword] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const resp = await apiService.get<ApiResponse>(
            `/user/reset-password/${token}`
          );
          setNewPassword(resp.data.newPassword);
          setEmail(resp.data.email);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      }
    };

    fetchData();
  }, []);
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-80 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Mật khẩu mới
        </h2>
        <p className="text-gray-700 mb-4">
          Mật khẩu mới của tài khoản{" "}
          <span className="font-semibold">{email}</span> là:
        </p>
        <div className="bg-gray-200 py-2 px-4 rounded-lg text-gray-900 font-mono text-lg">
          {newPassword}
        </div>
        <button
          className="mt-6 w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
          onClick={() => {
            router.push("/login");
          }}
        >
          Quay lại trang Đăng nhập
        </button>
      </div>
    </div>
  );
};

export default NewPassWord;
