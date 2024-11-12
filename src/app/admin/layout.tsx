// app/admin/destination/layout.tsx
"use client";
import AdminLayout from "@/app/admin/layout/main-layout";
import React from "react";


interface DestinationLayoutProps {
  children: React.ReactNode;
}

export default function DestinationLayout({
  children,
}: DestinationLayoutProps) {
  return <AdminLayout>{children}</AdminLayout>;
}
