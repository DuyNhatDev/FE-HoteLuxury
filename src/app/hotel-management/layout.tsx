"use client";
import HotelHeader from "@/app/layout/hotel/header";
import React from "react";

interface HotelManagementLayoutProps {
  children: React.ReactNode;
}

export default function HotelManagementLayout({
  children,
}: HotelManagementLayoutProps) {
  return <HotelHeader>{children}</HotelHeader>;
}
