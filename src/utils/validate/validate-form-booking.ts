import { BookingProps } from "@/utils/interface/BookingInterface";
import { RoomTypeProps } from "@/utils/interface/RoomTypeInterface";

export const validateForm = (
  formData: BookingProps,
  roomType: RoomTypeProps
): Record<string, string> => {
  const errors: Record<string, string> = {};
  const phoneRegex = /^\d{10}$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!formData.roomQuantity || formData.roomQuantity < 1) {
    errors.roomQuantity = "Số lượng phòng phải lớn hơn 0";
  } else if (
    roomType.availableRoomQuantity !== undefined &&
    formData.roomQuantity > roomType.availableRoomQuantity
  ) {
    errors.roomQuantity = `Không đủ phòng, chỉ còn ${roomType.availableRoomQuantity} phòng`;
  }

  if (!formData.customerName) {
    errors.customerName = "Họ và tên không được để trống";
  }
  if (!formData.customerPhone) {
    errors.customerPhone = "Vui lòng nhập số điện thoại";
  } else if (!phoneRegex.test(formData.customerPhone)) {
    errors.customerPhone = "Số điện thoại phải có 10 chữ số";
  }
  if (!formData.customerEmail) {
    errors.customerEmail = "Vui lòng nhập Email";
  } else if (!emailRegex.test(formData.customerEmail)) {
    errors.customerEmail = "Email không đúng định dạng";
  }

  if (!formData.paymentMethod) {
    errors.paymentMethod = "Vui lòng chọn phương thức thanh toán";
  }

  return errors;
};
