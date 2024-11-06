import { UserProps } from "@/utils/interface/UserInterface";

export const validateForm = (formData: UserProps, type: "add" | "edit") => {
  const errors: { [key in keyof UserProps]?: string } = {};

  if (!formData.email) {
    errors.email = "Vui lòng nhập email.";
  } else if (!/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)) {
    errors.email = "Định dạng email không hợp lệ.";
  }

  if (!formData.password && type === "add") {
    errors.password = "Vui lòng nhập mật khẩu";
  } else if (formData.password && formData.password.length < 6) {
    errors.password = "Mật khẩu phải có ít nhất 6 ký tự.";
  }

  if (!formData.fullname) {
    errors.fullname = "Vui lòng nhập họ tên.";
  }

  if (!formData.birthDate) {
    errors.birthDate = "Vui lòng nhập ngày sinh.";
  }

  if (!formData.gender) {
    errors.gender = "Vui lòng chọn giới tính.";
  }

  if (!formData.phoneNumber) {
    errors.phoneNumber = "Vui lòng nhập số điện thoại.";
  } else if (!/^\d{10}$/.test(formData.phoneNumber)) {
    errors.phoneNumber = "Số điện thoại phải phải có độ dài là 10 số.";
  }

  if (!formData.roleId) {
    errors.roleId = "Vui lòng chọn vai trò.";
  }

  if (!formData.address) {
    errors.address = "Vui lòng nhập địa chỉ.";
  }

  return errors;
};