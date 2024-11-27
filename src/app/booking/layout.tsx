"use client";
import HomeLayout from "@/app/home/layout/home-layout";
import React from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function DestinationLayout({ children }: LayoutProps) {
  return <HomeLayout>{children}</HomeLayout>;
}
