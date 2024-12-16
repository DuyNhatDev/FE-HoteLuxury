"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  MenuItem,
} from "@mui/material";
import StatisticsSection from "@/app/hotel-manager/dashboard/components/Statistics";
import ChartSection from "@/app/hotel-manager/dashboard/components/Chart";
import TableSection from "@/app/hotel-manager/dashboard/components/Table";
import { useRouter } from "next/navigation";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { StatisticsResponse } from "@/utils/interface/DashboardInterface";
export interface Hotel {
  hotelId: string;
  hotelName?: string;
}

const HotelManagerDashBoard = () => {
  const [hotelId, setHotelId] = useState<string>("");
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [statistics, setStatistics] = useState<StatisticsResponse>();
  const [refresh, setRefresh] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");

    if (!roleId || roleId === "R1" || roleId === "R3") {
      router.push("/not-found");
    }
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const resp = await apiService.get<ApiResponse<Hotel[]>>("/hotel");
        if (resp.data.data) {
          // const fetchedHotels = [...resp.data.data].reverse();
          const fetchedHotels = resp.data.data;
          setHotels(fetchedHotels);
          if (fetchedHotels.length > 0) {
            setHotelId(fetchedHotels[0].hotelId);
          }
        } else {
          setHotels([]);
        }
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      }
    };
    fetchHotel();
  }, []);

  useEffect(() => {
    if (!hotelId) return;
    const fetchStatistics = async () => {
      try {
        const resp = await apiService.get<StatisticsResponse>(
          `/user/hotel-manager/dashboard?hotelId=${hotelId}&time=tháng`
        );
        setStatistics(resp.data);
      } catch (error) {
        console.error("Failed to fetch hotels:", error);
      }
    };
    fetchStatistics();
  }, [hotelId, refresh]);

  // useEffect(() => {
  //   console.log("hotelId: ", hotelId);
  // }, [hotelId]);

  // useEffect(() => {
  //   console.log("statistics: ", statistics);
  // }, [statistics]);

  const handleChange = (
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setHotelId(event.target.value);
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto">
      <div
        className="bg-white flex items-center justify-start pl-4 py-2"
        style={{ height: "50px" }}
      >
        <TextField
          select
          margin="dense"
          label="Khách sạn"
          variant="outlined"
          size="small"
          value={hotelId || ""}
          onChange={handleChange}
          sx={{ width: 500 }}
        >
          {hotels.map((hotel: Hotel) => (
            <MenuItem key={hotel.hotelId} value={hotel.hotelId}>
              {hotel.hotelName}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {/* Phần Thống kê*/}
      <div className="flex-[1] bg-blue-50 p-4">
        <StatisticsSection refresh={refresh} data={statistics} />
      </div>

      {/* Phần biểu đồ */}
      <div className="flex-[3] flex items-center justify-center bg-gray-100">
        <ChartSection refresh={refresh} data={statistics} />
      </div>

      {/* Phần bảng */}
      {/* <div className="flex-[2] flex items-center justify-center bg-gray-200">
        <TableSection hotelId={hotelId} refresh={refresh} />
      </div> */}
    </div>
  );
};

export default HotelManagerDashBoard;
