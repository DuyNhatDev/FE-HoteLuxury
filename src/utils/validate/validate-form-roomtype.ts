import { RoomTypeProps } from "@/utils/interface/RoomTypeInterface";

export const validateForm = (formData: RoomTypeProps, type: "add" | "edit") => {
  const errors: { [key in keyof RoomTypeProps]?: string } = {};

  if (!formData.roomTypeName) {
    errors.roomTypeName = "Vui lòng tên loại phòng.";
  }

  if (!formData.roomTypePrice) {
    errors.roomTypePrice = "Vui lòng nhập giá.";
  }

  if (!formData.hotelId) {
    errors.hotelId = "Vui lòng chọn khách sạn.";
  }

  if (!formData.maxPeople) {
    errors.maxPeople = "Vui lòng số người tối đa.";
  }

  if (!formData.roomTypeQuantity) {
    errors.roomTypeQuantity = "Vui lòng nhập số lượng phòng.";
  }

  if (!formData.roomTypeDescription) {
    errors.roomTypeDescription = "Vui lòng nhập mô tả.";
  }

  return errors;
};
