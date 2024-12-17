"use client";
import { usePathname } from "next/navigation";
import Header from "@/app/layout/user/header";

export default function HeaderController() {
  const pathname = usePathname();
  if (
    pathname.startsWith("/hotel-manager") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/not-found") ||
    pathname.startsWith("/newpassword")
  ) {
    return null;
  }

  return <Header />;
}
