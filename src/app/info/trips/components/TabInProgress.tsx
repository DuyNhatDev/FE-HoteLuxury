import React, { useEffect, useState } from "react";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { BookingProps } from "@/utils/interface/BookingInterface";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

const TabInProgress = () => {
  const [orders, setOrders] = useState<BookingProps[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const params = new URLSearchParams();
        params.append("bookingStatus", "Đang thực hiện");
        const resp = await apiService.get<ApiResponse<BookingProps[]>>(
          `booking?${params.toString()}`
        );
        setOrders(resp.data.data);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };
    fetchOrders();
  }, []);

  useEffect(() => {
    console.log(orders);
  }, [orders]);

  return (
    <div className="p-6">
      {orders.length === 0 ? (
        <p className="text-gray-600">Chưa có đơn hàng nào</p>
      ) : (
        <List>
          {orders.map((order) => (
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
                    src={`http://localhost:9000/uploads/${order.roomTypeImage}`}
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
                        )} → ${dayjs(order.dayEnd).format("ddd, DD-MM-YYYY")}`}
                      </div>
                      <div className="text-gray-600 text-base">
                        <strong>Phòng: </strong>
                        {Array.isArray(order.roomNumber) &&
                        order.roomNumber.length > 0
                          ? order.roomNumber.join(", ")
                          : "Không xác định"}
                      </div>

                      <div className="text-green-500 font-bold text-base">
                        <strong>Giá: </strong>
                        {Number(order.price).toLocaleString("vi-VN")} VND
                      </div>
                    </div>
                  }
                />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
    </div>
  );
};

export default TabInProgress;
