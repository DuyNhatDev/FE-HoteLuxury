"use client";
import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname } from "next/navigation";

const BreadcrumbsNav = () => {
  const pathname = usePathname();
  const currentPage = () => {
    if (pathname === "/info/trips") return "Đơn hàng của tôi";
    else if (pathname === "/info/profile") return "Hồ sơ của tôi";
    else if (pathname === "/info/change-password") return "Đổi mật khẩu";
    else return "";
  };
  return (
    <div className="mb-6 ">
      <Breadcrumbs aria-label="breadcrumb">
        <Link
          href="/home"
          className="text-blue-600 hover:text-blue-600 cursor-pointer"
        >
          Trang chủ
        </Link>
        <Typography color="text.primary" className="text-gray-500">
          {currentPage()}
        </Typography>
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsNav;
