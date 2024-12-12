"use client";
import { useAppContext } from "@/hooks/AppContext";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { HotelProps } from "@/utils/interface/HotelInterface";
import { RoomTypeProps } from "@/utils/interface/RoomTypeInterface";
import {
  Button,
  Card,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  Radio,
  RadioGroup,
  TextField,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import DateRangeIcon from "@mui/icons-material/DateRange";
import KingBedIcon from "@mui/icons-material/KingBed";
import ErrorIcon from "@mui/icons-material/Error";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useState } from "react";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";
import "dayjs/locale/vi";
import { BookingProps } from "@/utils/interface/BookingInterface";
import { validateForm } from "@/utils/validate/validate-form-booking";
import { confirmBookingDialog } from "@/utils/notification/confirm-dialog";
import { UserProps } from "@/utils/interface/UserInterface";
dayjs.locale("vi");

const BookingForm = () => {
  const router = useRouter();
  const [hotel, setHotel] = useState<HotelProps>({});
  const [roomType, setRoomType] = useState<RoomTypeProps>({});
  const { hotelId, roomTypeId, dateRange } = useAppContext();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [user, setUser] = useState<UserProps>({});
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
    paymentMethod: "",
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

    const fetchUser = async () => {
      try {
        const id = localStorage.getItem("userId");
        const resp = await apiService.get<ApiResponse<UserProps>>(`user/${id}`);
        setUser(resp.data.data);
      } catch (error) {}
    };

    fetchUser();
    fetchHotel();
    fetchRoomType();
  }, []);

  useEffect(() => {
    if (user) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        customerName: user.fullname || "",
        customerPhone: user.phoneNumber || "",
        customerEmail: user.email || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (
      roomType.roomTypePrice !== undefined &&
      formData.roomQuantity !== undefined
    ) {
      const startDate = dateRange.dayStart
        ? new Date(dateRange.dayStart)
        : null;
      const endDate = dateRange.dayEnd ? new Date(dateRange.dayEnd) : null;
      let dayDifference = 1;
      if (startDate && endDate) {
        const timeDifference = endDate.getTime() - startDate.getTime();
        dayDifference = timeDifference / (1000 * 60 * 60 * 24);
      }
      const total =
        Number(roomType.roomTypePrice) * formData.roomQuantity * dayDifference;
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

  const handleSubmit = async () => {
    const newErrors = validateForm(formData, roomType);
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    const result = await confirmBookingDialog();
    if (result.isConfirmed) {
      try {
        const input_data = new FormData();
        const userId = localStorage.getItem("userId");
        if (roomTypeId && userId) {
          input_data.append("roomTypeId", roomTypeId);
          input_data.append("userId", userId);
          input_data.append("price", totalPrice.toString());
        }
        Object.keys(formData).forEach((key) => {
          const value = formData[key as keyof BookingProps];
          if (value) {
            input_data.append(key, value.toString());
          }
        });
        const resp = await apiService.post<ApiResponse<BookingProps>>(
          "/booking",
          input_data
        );
        const url = resp.data.data;
        if (url && typeof url === "string") {
          localStorage.setItem("activeTab", "1");
          window.location.href = url;
        } else {
          localStorage.setItem("activeTab", "0");
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Yêu cầu đặt phòng thành công");
          setTimeout(() => {
            router.push("/info/trips");
          }, 1000);
        }
      } catch (error) {
        console.log("Error fetching hotel:", error);
      }
    }
  };

  return (
    <div className="mx-auto px-4 py-5 bg-gray-100">
      <IconButton
        className="absolute top-12 left-0 m-4 pt-3 z-10"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBackIcon />
      </IconButton>
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
              InputLabelProps={{
                shrink: true,
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
            InputLabelProps={{
              shrink: true,
            }}
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
            InputLabelProps={{
              shrink: true,
            }}
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
            InputLabelProps={{
              shrink: true,
            }}
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

          <FormControl
            component="fieldset"
            className="mb-4"
            error={!!errors.paymentMethod}
          >
            <FormLabel
              component="legend"
              className="text-lg font-semibold text-blue-600 mb-2"
            >
              Phương thức thanh toán
            </FormLabel>
            <RadioGroup
              row
              aria-label="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
            >
              <FormControlLabel
                label="Thanh toán khi nhận phòng"
                value="Tiền mặt"
                control={<Radio />}
              />
              <FormControlLabel
                label="Thanh toán online"
                value="Chuyển khoản"
                control={<Radio />}
              />
            </RadioGroup>
            {errors.paymentMethod && (
              <FormHelperText>{errors.paymentMethod}</FormHelperText>
            )}
          </FormControl>

          {/* Submit Button */}
          <div className="mt-4">
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
              {isClient &&
                `${dayjs(dateRange.dayStart).format(
                  "ddd, DD-MM-YYYY"
                )} → ${dayjs(dateRange.dayEnd).format("ddd, DD-MM-YYYY")}`}
            </strong>
          </div>

          {/* Room Information */}
          <div className="flex items-start text-gray-700 my-3">
            <KingBedIcon className="mr-2 mt-1 text-green-500 text-xl" />
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
