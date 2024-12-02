import React from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockResetIcon from "@mui/icons-material/LockReset";
import { usePathname, useRouter } from "next/navigation";

const Sidebar = () => {
  const pathName = usePathname();
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className="w-1/4 bg-white shadow-md rounded-lg">
      <ul className="space-y-4 p-4">
        <li
          onClick={() => handleNavigation("/admin/profile")}
          className={`cursor-pointer flex items-center text-lg border-b border-gray-300 pb-2 ${
            pathName === "/admin/profile"
              ? "text-blue-500 font-semibold"
              : "text-black"
          } hover:text-blue-600 hover:underline`}
        >
          <AccountCircleIcon
            className={`mr-2 ${
              pathName === "/admin/profile" ? "text-blue-500" : "text-gray-500"
            } hover:text-blue-600`}
          />
          Hồ sơ
        </li>
        <li
          onClick={() => handleNavigation("/admin/change-password")}
          className={`cursor-pointer flex items-center text-lg border-b border-gray-300 pb-2 ${
            pathName === "/admin/change-password"
              ? "text-blue-500 font-semibold"
              : "text-black"
          } hover:text-blue-600 hover:underline`}
        >
          <LockResetIcon
            className={`mr-2 ${
              pathName === "/admin/change-password"
                ? "text-blue-500"
                : "text-gray-500"
            } hover:text-blue-600`}
          />
          Đổi mật khẩu
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
