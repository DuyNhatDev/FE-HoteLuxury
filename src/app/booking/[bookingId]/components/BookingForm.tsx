"use client";
import { useAppContext } from "@/hooks/AppContext";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { HotelProps } from "@/utils/interface/HotelInterface";
import { RoomTypeProps } from "@/utils/interface/RoomTypeInterface";
import { Button, Card, TextField } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DateRangeIcon from "@mui/icons-material/DateRange";
import KingBedIcon from "@mui/icons-material/KingBed";
import ErrorIcon from "@mui/icons-material/Error";
import React, { useEffect, useState } from "react";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { useRouter } from "next/navigation";

interface BookingProps {
  dayStart?: string;
  dayEnd?: string;
  roomQuantity?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  note?: string;
}
const BookingForm = () => {
  const router = useRouter();
  const [hotel, setHotel] = useState<HotelProps>({});
  const [roomType, setRoomType] = useState<RoomTypeProps>({});
  const { hotelId, roomTypeId, dateRange } = useAppContext();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [formData, setFormData] = useState<BookingProps>({
    dayStart: dateRange.dayStart || "",
    dayEnd: dateRange.dayEnd || "",
    roomQuantity: undefined,
    customerName: "",
    customerPhone: "",
    customerEmail: "",
    note: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const resp = await apiService.get<ApiResponse<HotelProps>>(
          `hotel/${hotelId}`
        );
        setHotel(resp.data.data);
      } catch (error) {
        console.log("Error fetching hotel:", error);
      }
    };

    fetchHotel();
  }, []);

  useEffect(() => {
    const fetchRoomType = async () => {
      try {
        const params = new URLSearchParams();
        if (dateRange.dayStart) params.append("dayStart", dateRange.dayStart);
        if (dateRange.dayEnd) params.append("dayEnd", dateRange.dayEnd);
        const resp = await apiService.get<ApiResponse<RoomTypeProps>>(
          `room-type/${roomTypeId}?${params.toString()}`
        );
        setRoomType(resp.data.data);
      } catch (error) {
        console.log("Error fetching hotel:", error);
      }
    };
    fetchRoomType();
  }, []);

  useEffect(() => {
    if (
      roomType.roomTypePrice !== undefined &&
      formData.roomQuantity !== undefined
    ) {
      const total = Number(roomType.roomTypePrice) * formData.roomQuantity;
      setTotalPrice(total);
    }
  }, [roomType.roomTypePrice, formData.roomQuantity]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const phoneRegex = /^\d{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.roomQuantity || formData.roomQuantity < 1) {
      newErrors.roomQuantity = "Số lượng phòng phải lớn hơn 0";
    } else if (
      roomType.availableRoomQuantity !== undefined &&
      formData.roomQuantity > roomType.availableRoomQuantity
    ) {
      newErrors.roomQuantity = "Không đủ phòng";
    }

    if (!formData.customerName) {
      newErrors.customerName = "Họ và tên không được để trống";
    }
    if (!formData.customerPhone) {
      newErrors.customerPhone = "Vui lòng nhập số điện thoại";
    } else if (!phoneRegex.test(formData.customerPhone)) {
      newErrors.customerPhone = "Số điện thoại phải có 10 chữ số";
    }
    if (!formData.customerEmail) {
      newErrors.customerEmail = "Vui lòng nhập Email";
    } else if (!emailRegex.test(formData.customerEmail)) {
      newErrors.customerEmail = "Email không đúng định dạng";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (validateForm()) {
      setOpenSnackbar(true);
      setSnackbarSeverity("success");
      setSnackbarMessage("Đặt phòng thành công");
      router.push("/home");
    } else {
      return;
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 max-w-6xl mx-auto">
        {/* Phần bên trái */}
        <div className="lg:col-span-4 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-3 mt-1 text-blue-800">
            Thông tin người đặt
          </h2>
          <p className="text-lg text-gray-500 italic mb-6">
            Vui lòng điền đầy đủ thông tin
          </p>

          {/* Quantity */}
          <div className="mb-4">
            <TextField
              label="Số lượng phòng *"
              type="number"
              name="roomQuantity"
              placeholder={
                roomType.availableRoomQuantity !== undefined
                  ? `Còn ${roomType.availableRoomQuantity} phòng`
                  : ""
              }
              value={formData.roomQuantity}
              onChange={handleInputChange}
              InputProps={{
                inputProps: { min: 1 },
              }}
              error={!!errors.roomQuantity}
              helperText={errors.roomQuantity}
              fullWidth
            />
          </div>

          {/* Name */}
          <TextField
            label="Họ và tên đầy đủ *"
            placeholder="VD: Nguyen Van A"
            fullWidth
            className="mb-4"
            name="customerName"
            value={formData.customerName}
            onChange={handleInputChange}
            error={!!errors.customerName}
            helperText={errors.customerName}
          />

          {/* Phone */}
          <TextField
            label="Số điện thoại liên hệ *"
            placeholder="Nhập số điện thoại"
            fullWidth
            className="mb-4"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={handleInputChange}
            error={!!errors.customerPhone}
            helperText={errors.customerPhone}
          />

          {/* Email */}
          <TextField
            label="Email *"
            placeholder="Nhập email"
            fullWidth
            className="mb-4"
            name="customerEmail"
            value={formData.customerEmail}
            onChange={handleInputChange}
            error={!!errors.customerEmail}
            helperText={errors.customerEmail}
          />

          {/* Special Requests */}
          <TextField
            label="Ghi chú"
            placeholder="Nếu quý khách có ghi chú, vui lòng cho chúng tôi biết tại đây"
            fullWidth
            multiline
            rows={3}
            className="mb-4"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
          />

          {/* Submit Button */}
          <div className="mt-6">
            <Button
              variant="contained"
              color="warning"
              fullWidth
              className="py-2 text-white"
              onClick={handleSubmit}
            >
              Yêu cầu đặt phòng
            </Button>
          </div>
        </div>

        {/* Phần bên phải */}
        <Card className="p-4 shadow-lg lg:col-span-3 bg-white rounded-lg">
          <h2 className="text-2xl font-bold my-3 text-blue-800">
            {hotel.hotelName}
          </h2>

          {/* Address */}
          <div className="flex items-start text-gray-700 my-3">
            <LocationOnIcon className="mr-2 text-red-500 text-xl" />
            <span className="break-words !text-lg md:text-base font-medium">
              {hotel.hotelAddress}
            </span>
          </div>

          {/* Stay Dates */}
          <div className="text-gray-600 my-3 flex items-center">
            <DateRangeIcon className="mr-2 text-blue-500 text-xl" />
            <strong className="!text-lg md:text-base font-semibold">
              {isClient && `${dateRange.dayStart} → ${dateRange.dayEnd}`}
            </strong>
          </div>

          {/* Room Information */}
          <div className="flex items-start text-gray-700 my-3">
            <KingBedIcon className="mr-2 text-green-500 text-xl" />
            <span className="break-words !text-lg md:text-base font-medium">
              {roomType.roomTypeName}
            </span>
          </div>

          {/* Note */}
          <div className="flex items-start text-gray-600 my-3">
            <ErrorIcon className="mr-2 text-gray-400 text-xl" />
            <span className="break-words !text-lg md:text-base font-normal italic">
              Không thể hoàn hoặc hủy thay đổi
            </span>
          </div>

          {/* Total Payment */}
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-bold my-3 text-blue-800">
              Tổng thanh toán:
            </h2>
            <span className="font-bold text-blue-600">
              {Number(totalPrice).toLocaleString("vi-VN")} VND
            </span>
          </div>
        </Card>
      </div>
      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
};

export default BookingForm;