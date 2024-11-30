import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { BookingProps } from "@/utils/interface/BookingInterface";
import dayjs from "dayjs";
import "dayjs/locale/vi";
dayjs.locale("vi");

interface DetailBookingProps {
  open: boolean;
  onClose: () => void;
  id?: number;
}

const DetailBookingPopup: React.FC<DetailBookingProps> = ({
  open,
  onClose,
  id,
}) => {
  const [formData, setFormData] = useState<BookingProps>({});

  useEffect(() => {
    fetchData();
  }, [open]);

  const fetchData = async () => {
    try {
      if (id) {
        const res = await apiService.get<ApiResponse<BookingProps>>(
          `booking/${id}`
        );
        const data = res.data.data;
        const updatedFormData = {
          hotelName: data.hotelName || "",
          roomTypeName: data.roomTypeName || "",
          customerName: data.customerName || "",
          customerPhone: data.customerPhone || "",
          customerEmail: data.customerEmail || "",
          dayStart: data.dayStart || "",
          dayEnd: data.dayEnd || "",
          paymentMethod: data.paymentMethod || "",
          status: data.status || "",
          isConfirmed: data.isConfirmed || false,
          price: data.price || "",
          roomQuantity: data.roomQuantity || "",
          roomNumber: data.roomNumber || [],
        };
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...updatedFormData,
        }));
      }
    } catch (error) {
      console.log(error);
      console.error("Error fetching data:", error);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        style: {
          width: "900px",
          position: "absolute",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0px 8px 24px rgba(0, 0, 0, 0.15)",
          padding: "24px",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          color: "#2E3A59",
          fontSize: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 16px 16px 16px",
          borderBottom: "1px solid #E0E0E0",
        }}
      >
        Thông tin Đơn đặt phòng
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "#727272",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent
        sx={{
          padding: "0px",
          backgroundColor: "#F8F9FC",
        }}
      >
        <Box
          display="flex"
          flexDirection="column"
          gap={3}
          padding="20px"
          border="1px solid #E0E0E0"
          borderRadius="12px"
          bgcolor="#FFFFFF"
          boxShadow="0px 4px 12px rgba(0, 0, 0, 0.1)"
        >
          {/* Group Component */}
          {[
            {
              title: "Thông tin khách sạn",
              fields: [
                {
                  label: "Tên khách sạn",
                  value: formData.hotelName,
                },
                {
                  label: "Loại phòng",
                  value: formData.roomTypeName,
                },
              ],
            },
            {
              title: "Thông tin khách hàng",
              fields: [
                {
                  label: "Tên khách hàng",
                  value: formData.customerName,
                },
                {
                  label: "Số điện thoại",
                  value: formData.customerPhone,
                },
                {
                  label: "Email",
                  value: formData.customerEmail,
                },
                {
                  label: "Phương thức thanh toán",
                  value: formData.paymentMethod,
                },
              ],
            },
            {
              title: "Thông tin đặt phòng",
              fields: [
                {
                  label: "Ngày nhận phòng",
                  value: formData.dayStart
                    ? dayjs(formData.dayStart).format("ddd, DD-MM-YYYY")
                    : "N/A",
                },
                {
                  label: "Ngày trả phòng",
                  value: formData.dayEnd
                    ? dayjs(formData.dayEnd).format("ddd, DD-MM-YYYY")
                    : "N/A",
                },
                {
                  label: "Trạng thái",
                  value: formData.status,
                },
                {
                  label: "Xác nhận",
                  value: formData.isConfirmed
                    ? "Đã xác nhận"
                    : formData.isConfirmed === false
                    ? "Chưa xác nhận"
                    : "N/A",
                },
                {
                  label: "Số lượng",
                  value: formData.roomQuantity,
                },
                {
                  label: "Phòng",
                  value:
                    Array.isArray(formData.roomNumber) &&
                    formData.roomNumber.length > 0
                      ? formData.roomNumber.join(", ")
                      : "Không có phòng nào",
                },

                {
                  label: "Tổng giá",
                  value: formData.price
                    ? `${Number(formData.price).toLocaleString("vi-VN")} VND`
                    : "N/A",
                },
              ],
            },
          ].map(({ title, fields }) => (
            <Box key={title} marginBottom="16px">
              <Typography
                variant="subtitle1"
                sx={{
                  fontWeight: "600",
                  fontSize: "20px",
                  color: "#2E3A59",
                  marginBottom: "8px",
                  borderBottom: "1px solid #E0E0E0",
                  paddingBottom: "4px",
                }}
              >
                {title}
              </Typography>
              <Box display="flex" flexWrap="wrap" gap="16px">
                {fields.map(({ label, value }) => (
                  <Box key={label} flex={1} minWidth="200px">
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{
                        fontSize: "14px",
                        color: "#727272",
                        marginBottom: "4px",
                      }}
                    >
                      {label}
                    </Typography>
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: "bold",
                        fontSize: "16px",
                        color: "#2E3A59",
                      }}
                    >
                      {value || "N/A"}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DetailBookingPopup;
