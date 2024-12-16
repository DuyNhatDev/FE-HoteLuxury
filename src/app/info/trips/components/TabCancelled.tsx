import React, { useEffect, useState } from "react";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { BookingProps } from "@/utils/interface/BookingInterface";
import {
  Avatar,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const TabCancelled = () => {
  const [orders, setOrders] = useState<BookingProps[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams();
        params.append("bookingStatus", "Đã hủy");
        const resp = await apiService.get<ApiResponse<BookingProps[]>>(
          `booking?${params.toString()}`
        );
        setOrders([...resp.data.data].reverse());
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="p-6">
      {orders.length === 0 ? (
        <p className="text-gray-600">Chưa có đơn nào</p>
      ) : (
        <List>
          {orders
            .filter((order, index, self) => {
              // Lấy danh sách các order có `hotelName` trùng nhau
              const sameHotelOrders = self.filter(
                (o) => o.hotelName === order.hotelName
              );

              // Nếu chỉ có 1 order với `hotelName` này thì giữ lại luôn
              if (sameHotelOrders.length === 1) return true;

              // Kiểm tra các điều kiện trùng lặp
              const isDayStartUnique =
                sameHotelOrders.filter(
                  (o) =>
                    o.dayStart === order.dayStart && o.dayEnd !== order.dayEnd
                ).length === 0;

              const isDayEndUnique =
                sameHotelOrders.filter(
                  (o) =>
                    o.dayEnd === order.dayEnd && o.dayStart !== order.dayStart
                ).length === 0;

              // Hiển thị nếu `dayStart` hoặc `dayEnd` là duy nhất trong nhóm `sameHotelOrders`
              return isDayStartUnique || isDayEndUnique;
            })
            .map((order) => (
              <React.Fragment key={order.bookingId}>
                <ListItem
                  alignItems="center"
                  sx={{
                    backgroundColor: "#f5f5f5",
                    borderRadius: "8px",
                    marginBottom: "16px",
                    minHeight: "140px",
                    padding: "16px",
                  }}
                >
                  <ListItemAvatar>
                    <Avatar
                      variant="square"
                      src={`https://be-hote-luxury.vercel.app/uploads/${order.roomTypeImage}`}
                      alt={order.roomTypeName || "Hotel Room"}
                      sx={{ width: 180, height: 120, marginRight: 16 }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <div className="font-bold text-lg text-blue-800">
                        {order.hotelName || "Tên khách sạn"}
                      </div>
                    }
                    secondary={
                      <div className="mt-2 space-y-2">
                        <div className="text-gray-600 text-base">
                          <strong>Loại phòng: </strong>
                          {order.roomTypeName || "Không xác định"}
                        </div>
                        <div className="text-gray-500 text-sm">
                          <strong>Thời gian: </strong>
                          {`${dayjs(order.dayStart).format(
                            "ddd, DD-MM-YYYY"
                          )} → ${dayjs(order.dayEnd).format(
                            "ddd, DD-MM-YYYY"
                          )}`}
                        </div>
                        <div className="text-green-500 font-bold text-base">
                          <strong>Giá: </strong>
                          {Number(order.price).toLocaleString("vi-VN")} VND
                        </div>
                      </div>
                    }
                  />
                  <div
                    style={{
                      border: "1px solid red",
                      color: "red",
                      padding: "6px 16px",
                      borderRadius: "4px",
                      fontSize: "14px",
                      textAlign: "center",
                      marginLeft: "auto",
                      alignSelf: "center",
                      opacity: 0.6,
                      pointerEvents: "none",
                    }}
                  >
                    {order.status === "Đã hết phòng"
                      ? "Đã hết phòng"
                      : "Đã hủy"}
                  </div>
                </ListItem>
              </React.Fragment>
            ))}
        </List>
      )}
    </div>
  );
};

export default TabCancelled;
