"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  MenuItem,
} from "@mui/material";
import StatisticsSection from "@/app/hotel-manager/dashboard/components/Statistics";
import ChartSection from "@/app/hotel-manager/dashboard/components/Chart";
import TableSection from "@/app/hotel-manager/dashboard/components/Table";
import { useRouter } from "next/navigation";

const HotelManagerDashBoard = () => {
  const [selectedValue, setSelectedValue] = useState("");
  const [hotelId, setHotelId] = useState<number>();
  const [refresh, setRefresh] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");

    if (!roleId || roleId === "R1" || roleId === "R3") {
      router.push("/not-found");
    }
  }, []);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <div
        className="bg-white flex items-center justify-start pl-4"
        style={{ height: "40px" }}
      >
        <TextField
          select
          size="small"
          value={selectedValue}
          onChange={handleChange}
          variant="outlined"
          sx={{ width: 300 }}
        >
          <MenuItem value="option1">Khách sạn 1</MenuItem>
          <MenuItem value="option2">Khách sạn 2</MenuItem>
          <MenuItem value="option3">Khách sạn 3</MenuItem>
        </TextField>
      </div>

      {/* Phần Thống kê*/}
      <div className="flex-[1] bg-blue-50 p-4">
        <StatisticsSection hotelId={hotelId} refresh={refresh} />
      </div>

      {/* Phần biểu đồ */}
      <div className="flex-[2] flex items-center justify-center bg-gray-100">
        <ChartSection hotelId={hotelId} refresh={refresh} />
      </div>

      {/* Phần bảng */}
      <div className="flex-[2] flex items-center justify-center bg-gray-200">
        <TableSection hotelId={hotelId} refresh={refresh} />
      </div>
    </div>
  );
};

export default HotelManagerDashBoard;
