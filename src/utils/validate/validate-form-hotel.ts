import { HotelProps } from "@/utils/interface/HotelInterface";

export const validateForm = (formData: HotelProps, type: "add" | "edit") => {
  const errors: { [key in keyof HotelProps]?: string } = {};


//   if (!formData.password && type === "add") {
//     errors.password = "Vui lòng nhập mật khẩu";
//   } else if (formData.password && formData.password.length < 6) {
//     errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
//   }

  if (!formData.hotelName) {
    errors.hotelName = "Vui lòng nhập họ tên khách sạn.";
  }

  if (!formData.hotelType) {
    errors.hotelType = "Vui lòng nhập loại khách sạn.";
  }

  if (!formData.userId) {
    errors.userId = "Vui lòng chọn chủ sở hữu.";
  }

  if (!formData.hotelPhoneNumber) {
    errors.hotelPhoneNumber = "Vui lòng nhập số điện thoại.";
  } else if (!/^\d{10}$/.test(formData.hotelPhoneNumber)) {
    errors.hotelPhoneNumber = "Số điện thoại phải phải có độ dài là 10 số.";
  }

  if (!formData.hotelAddress) {
    errors.hotelAddress = "Vui lòng nhập địa chỉ.";
  }

  if (!formData.hotelStar) {
    errors.hotelStar = "Vui lòng chọn số sao.";
  }

  return errors;
};
