"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const AdminDashBoard = () => {
  const router = useRouter();

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");

    if (!roleId || roleId === "R1" || roleId === "R3") {
      router.push("/not-found");
    }
  }, []);

  return (
    <div>
      <h1>Admin DashBoard</h1>
    </div>
  );
};

export default AdminDashBoard;
