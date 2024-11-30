import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const pathName = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path); // Chuyển hướng đến trang tương ứng
  };

  return (
    <div className="w-1/4 bg-white shadow-md rounded-lg">
      <ul className="space-y-4 p-4">
        <li
          onClick={() => handleNavigation("/info/profile")}
          className={`cursor-pointer flex items-center text-lg border-b border-gray-300 pb-2 ${
            pathName === "/info/profile"
              ? "text-blue-500 font-semibold"
              : "text-black"
          } hover:text-blue-600 hover:underline`}
        >
          <AccountCircleIcon
            className={`mr-2 ${
              pathName === "/info/profile" ? "text-blue-500" : "text-gray-500"
            } hover:text-blue-600`}
          />
          Hồ sơ của tôi
        </li>
        <li
          onClick={() => handleNavigation("/info/trips")}
          className={`cursor-pointer flex items-center text-lg border-b border-gray-300 pb-2 ${
            pathName === "/info/trips"
              ? "text-blue-500 font-semibold"
              : "text-black"
          } hover:text-blue-600 hover:underline`}
        >
          <DescriptionIcon
            className={`mr-2 ${
              pathName === "/info/trips" ? "text-blue-500" : "text-gray-500"
            } hover:text-blue-600`}
          />
          Đơn hàng của tôi
        </li>
        <li
          onClick={() => {
            localStorage.clear();
            handleNavigation("/login");
          }}
          className="cursor-pointer flex items-center text-black text-lg pb-2 hover:text-blue-600 hover:underline"
        >
          <LogoutIcon className="mr-2 text-gray-500 hover:text-blue-600" />
          Đăng xuất
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
