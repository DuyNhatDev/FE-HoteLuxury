import React, { useEffect, useState } from "react";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { BookingProps } from "@/utils/interface/BookingInterface";
import Button from "@mui/material/Button";
import {
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { cancelBooking } from "@/utils/notification/confirm-dialog";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { useRouter } from "next/navigation";
dayjs.locale("vi");

const TabPending = () => {
  const router = useRouter();
  const [orders, setOrders] = useState<BookingProps[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const params = new URLSearchParams();
      params.append("bookingStatus", "Chờ xác nhận");
      const resp = await apiService.get<ApiResponse<BookingProps[]>>(
        `booking?${params.toString()}`
      );
      setOrders([...resp.data.data].reverse());
    } catch (error) {
      console.log("Error fetching orders:", error);
    }
  };

  // useEffect(() => {
  //   console.log(orders);
  // }, [orders]);

  const handleCancel = async (id: number) => {
    const result = await cancelBooking();
    if (result.isConfirmed) {
      try {
        const resp = await apiService.put(`/booking/${id}`, {
          isConfirmed: true,
          status: "Đã hủy",
        });
        if (resp && resp.status === 200) {
          localStorage.setItem("activeTab", "4");
          fetchOrders();
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Hủy đơn thành công");
          window.location.reload();
        } else {
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Đã xảy ra lỗi");
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <div className="p-6">
      {orders.length === 0 ? (
        <p className="text-gray-600">Chưa có đơn nào</p>
      ) : (
        <List>
          {orders.map((order) => (
            <React.Fragment key={order.bookingId}>
              <ListItem
                alignItems="center" // Đặt alignItems thành center để căn giữa theo chiều dọc
                sx={{
                  backgroundColor: "#f5f5f5", // Màu nền xám nhạt
                  borderRadius: "8px", // Bo góc cho phần tử
                  marginBottom: "16px", // Khoảng cách giữa các phần tử
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
                  sx={{ maxWidth: "400px" }}
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
                      <div className="text-green-500 font-bold text-base">
                        <strong>Giá: </strong>
                        {Number(order.price).toLocaleString("vi-VN")} VND
                      </div>
                    </div>
                  }
                />

                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => handleCancel(order.bookingId || -1)}
                  sx={{
                    marginLeft: "auto",
                    alignSelf: "center",
                  }}
                >
                  Hủy đơn
                </Button>
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      )}
      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
};

export default TabPending;
