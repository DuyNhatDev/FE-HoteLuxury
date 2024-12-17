"use client";
import { usePathname } from "next/navigation";

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldHavePadding =
    !pathname.startsWith("/hotel-manager") &&
    !pathname.startsWith("/admin") &&
    !pathname.startsWith("/newpassword");

  return (
    <main style={{ paddingTop: shouldHavePadding ? "56px" : "0" }}>
      {children}
    </main>
  );
}

export default MainLayout;
