"use client";
import { usePathname } from "next/navigation";
import Footer from "@/app/layout/user/footer";

export default function FooterController() {
  const pathname = usePathname();
  if (pathname.startsWith("/hotel-manager") || pathname.startsWith("/admin")) {
    return null;
  }

  return <Footer />;
}
