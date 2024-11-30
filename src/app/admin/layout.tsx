"use client";
import AdminHeader from "@/app/layout/admin/header";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return <AdminHeader>{children}</AdminHeader>;
}
