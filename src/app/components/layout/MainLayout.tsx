"use client";
import { usePathname } from "next/navigation";

function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const shouldHavePadding =
    !pathname.startsWith("/hotel-management") && !pathname.startsWith("/admin");

  return (
    <main style={{ paddingTop: shouldHavePadding ? "56px" : "0" }}>
      {children}
    </main>
  );
}

export default MainLayout;
