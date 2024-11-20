import { RoomProps } from "@/utils/interface/RoomInterface";

export const validateForm = (formData: RoomProps, type: "add" | "edit") => {
  const errors: { [key in keyof RoomProps]?: string } = {};

  if (!formData.hotelId) {
    errors.hotelId = "Vui lòng chọn khách sạn.";
  }

  if (!formData.roomTypeId) {
    errors.roomTypeId = "Vui lòng chọn loại phòng.";
  }

  if (!formData.roomNumber) {
    errors.roomNumber = "Vui lòng số phòng.";
  }

  return errors;
};
