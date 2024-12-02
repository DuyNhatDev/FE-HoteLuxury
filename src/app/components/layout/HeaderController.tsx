"use client";
import { usePathname } from "next/navigation";
import Header from "@/app/layout/user/header";

export default function HeaderController() {
  const pathname = usePathname();
  if (pathname.startsWith("/hotel-manager") || pathname.startsWith("/admin")) {
    return null;
  }

  return <Header />;
}
