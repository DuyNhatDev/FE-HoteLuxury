"use client";
import HotelLayout from "@/app/hotel-management/layout/main-layout";
import React from "react";

interface DestinationLayoutProps {
  children: React.ReactNode;
}

export default function DestinationLayout({
  children,
}: DestinationLayoutProps) {
  return <HotelLayout>{children}</HotelLayout>;
}
