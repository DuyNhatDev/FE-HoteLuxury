export const validateFullName = (value: string) => {
  if (!value) {
    return 'Họ và tên không được để trống';
  }
  return true;
};

export const validateEmail = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!value) {
    return 'Email không được để trống';
  } else if (!emailRegex.test(value)) {
    return 'Email không hợp lệ';
  }
  return true;
};

export const validateEmailAndPhone = (value: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^[0-9]{10}$/;

  if (!value) {
    return 'Email hoặc số điện thoại không được để trống';
  } else if (!emailRegex.test(value) && !phoneRegex.test(value)) {
    return 'Email hoặc số điện thoại không hợp lệ';
  }
  return true;
};

export const validatePassword = (value: string) => {
  if (!value) {
    return 'Mật khẩu không được để trống';
  } else if (value.length < 6) {
    return 'Mật khẩu tối thiểu 6 ký tự';
  }
  return true;
};

export const validateConfirmPassword = (password: string, confirmPassword: string) => {
  if (!confirmPassword) {
    return 'Mật khẩu nhập lại không được để trống';
  } else if (confirmPassword !== password) {
    return 'Mật khẩu không trùng khớp';
  }
  return true;
};
