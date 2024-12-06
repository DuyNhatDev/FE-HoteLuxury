"use client";
import React from "react";
import { Breadcrumbs, Link, Typography } from "@mui/material";
import { usePathname, useRouter } from "next/navigation";

const BreadcrumbsNav = () => {
  const pathname = usePathname();
  const router = useRouter();
  const currentPage = () => {
    if (pathname === "/info/trips") return "Đơn phòng của tôi";
    else if (pathname === "/info/profile") return "Hồ sơ của tôi";
    else if (pathname === "/info/change-password") return "Đổi mật khẩu";
    else return "";
  };
  return (
    <div className="mb-6 ">
      <Breadcrumbs aria-label="breadcrumb">
        {/* <Link
          href="/home"
          className="text-blue-600 hover:text-blue-600 cursor-pointer"
        >
          Trang chủ
        </Link> */}
        <span
          onClick={() => {
            sessionStorage.clear();
            router.push("/home");
          }}
          className="text-md text-indigo-600 hover:underline cursor-pointer"
        >
          Trang chủ
        </span>
        <Typography color="text.primary" className="text-gray-500">
          {currentPage()}
        </Typography>
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsNav;
