import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  MenuItem,
  Button,
  IconButton,
  Box,
  Typography,
  Switch,
  Snackbar,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import apiService from "@/services/api";

interface CreateEditProps {
  open: boolean;
  onClose: () => void;
  id?: number;
  type: string;
}

interface UserProps {
  email: string;
  password: string;
  fullname: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  roleId: string;
  address: string;
  image: string | null;
}

interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}

const CreateEditPopup: React.FC<CreateEditProps> = ({
  open,
  onClose,
  id,
  type,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [hover, setHover] = useState(false);
  const [formData, setFormData] = useState<UserProps>({
    email: "",
    password: "",
    fullname: "",
    gender: "",
    birthDate: "",
    phoneNumber: "",
    roleId: "",
    address: "",
    image: "",
  });
  const [formErrors, setFormErrors] = useState<{
    [key in keyof UserProps]?: string;
  }>({});

  const validateForm = () => {
    const errors: { [key in keyof UserProps]?: string } = {};

    if (!formData.email) {
      errors.email = "Vui lòng nhập email.";
    } else if (
      !/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/.test(formData.email)
    ) {
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleInputChange = (key: keyof UserProps, value: string | number) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  useEffect(() => {
    if (open) {
      if (type === "edit" && id) {
        fetchData();
      } else {
        resetData();
      }
    } else {
      resetData();
    }
  }, [open]);

  useEffect(() => {}, [formData]);

  const resetData = () => {
    setFormData({
      email: "",
      password: "",
      fullname: "",
      gender: "",
      birthDate: "",
      phoneNumber: "",
      roleId: "",
      address: "",
      image: "",
    });
    setFormErrors({});
    setSelectedFile(null);
    setShowPassword(false);
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarSeverity("success");
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    const input_data = new FormData();
    const fields: (keyof typeof formData)[] = [
      "email",
      "fullname",
      "gender",
      "birthDate",
      "roleId",
      "phoneNumber",
      "address",
    ];

    if (type === "add") fields.push("password");
    fields.forEach((field) => {
      if (formData[field]) input_data.append(field, formData[field]);
    });
    if (selectedFile) input_data.append("image", selectedFile);

    try {
      const url = type === "add" ? "/user" : `user/${id}`;
      const method = type === "add" ? "post" : "put";
      const successMessage =
        type === "add" ? "Thêm user thành công" : "Cập nhật user thành công";
      const errorMessage =
        type === "add" ? "Thêm thất bại" : "Cập nhật thất bại";

      //   const response = await apiService[method](url, input_data, {
      //     headers: { "Content-Type": "multipart/form-data" },
      //   });
        const response = await apiService[method](url, input_data);

      if (response.status === 200) {
        setSnackbarSeverity("success");
        setSnackbarMessage(successMessage);
        setOpenSnackbar(true);
        setTimeout(() => {
          onClose();
          setOpenSnackbar(false);
        }, 1000);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage(errorMessage);
        setOpenSnackbar(true);
      }
    } catch (error: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };


  const fetchData = async () => {
    try {
      const res = await apiService.get<ApiResponse<UserProps>>(`user/${id}`);
      const userData = res.data.data;
      const updatedFormData = {
      email: userData.email || "",
      fullname: userData.fullname || "",
      gender: userData.gender || "",
      birthDate: userData.birthDate ? userData.birthDate.split("T")[0] : "",
      roleId: userData.roleId || "",
      phoneNumber: userData.phoneNumber || "",
      address: userData.address || "",
      image: userData.image ? `http://localhost:9000/uploads/${userData.image}` : "",
    };
    setFormData((prevFormData) => ({ ...prevFormData, ...updatedFormData }));
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prevData) => ({
          ...prevData,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);

      const maxSize = 100 * 1024 * 1024;
      if (file.size > maxSize) {
        alert("File quá lớn. Vui lòng chọn file dưới 100 MB.");
        return;
      }

      setSelectedFile(file);
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
          width: "1100px",
          position: "absolute",
          backgroundColor: "#f9fafc",
          borderRadius: "12px",
          boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>
        {type === "add" ? "Thêm mới" : "Chỉnh sửa"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: "#727272",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          gap="20px"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="25%"
            height="340px"
            border="1px solid #e0e0e0"
            borderRadius="10px"
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.05)"
            padding="16px"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px dashed #9e9e9e"
              borderRadius="50%"
              width={180}
              height={180}
              sx={{
                backgroundColor: "#f4f6f8",
                transition: "0.3s",
                "&:hover": {
                  borderColor: "#333",
                },
              }}
              marginTop="10px"
            >
              {formData.image ? (
                <Box
                  position="relative"
                  width="100%"
                  height="100%"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <img
                    src={formData.image}
                    alt="avatar"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "50%",
                      transition: "0.3s",
                    }}
                  />
                  {hover && (
                    <>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-avatar1"
                        type="file"
                        onChange={handleFileChange}
                      />
                      <label htmlFor="upload-avatar1">
                        <IconButton
                          component="span"
                          sx={{
                            position: "absolute",
                            bottom: "10px",
                            right: "10px",
                            backgroundColor: "#ffffff",
                            "&:hover": {
                              backgroundColor: "#f0f0f0",
                            },
                          }}
                        >
                          <AddAPhotoIcon sx={{ fontSize: 25, color: "#333" }} />
                        </IconButton>
                      </label>
                    </>
                  )}
                </Box>
              ) : (
                <>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-avatar"
                    type="file"
                    onChange={handleFileChange}
                  />
                  <label htmlFor="upload-avatar">
                    <IconButton component="span">
                      <AddAPhotoIcon sx={{ fontSize: 25, color: "#727272" }} />
                    </IconButton>
                  </label>
                  <Typography
                    align="center"
                    sx={{ fontSize: "14px", color: "#9e9e9e" }}
                  >
                    Tải ảnh đại diện
                  </Typography>
                </>
              )}
            </Box>
            <Typography
              align="center"
              sx={{ marginTop: "20px", fontSize: "14px", color: "#9e9e9e" }}
            >
              *.jpeg, *.jpg, *.png.
            </Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            width="75%"
            border="1px solid #e0e0e0"
            borderRadius="10px"
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.05)"
            padding="16px"
          >
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
              marginTop="16px"
              padding="8px"
            >
              <TextField
                margin="dense"
                label="Email"
                fullWidth
                type="email"
                variant="outlined"
                size="small"
                required
                disabled={type === "edit"}
                error={!!formErrors.email}
                helperText={formErrors.email}
                value={formData.email}
                onChange={(event) =>
                  handleInputChange("email", event.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Mật khẩu"
                type={showPassword ? "text" : "password"}
                fullWidth
                variant="outlined"
                size="small"
                required
                disabled={type === "edit"}
                error={!!formErrors.password}
                helperText={formErrors.password}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ),
                }}
                value={formData.password}
                onChange={(event) =>
                  handleInputChange("password", event.target.value)
                }
              />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
              padding="8px"
            >
              <TextField
                margin="dense"
                label="Họ và tên"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.fullname}
                helperText={formErrors.fullname}
                value={formData.fullname}
                onChange={(event) =>
                  handleInputChange("fullname", event.target.value)
                }
              />
              <TextField
                margin="dense"
                label="Ngày sinh"
                fullWidth
                type="date"
                variant="outlined"
                size="small"
                required
                error={!!formErrors.birthDate}
                helperText={formErrors.birthDate}
                value={formData.birthDate}
                onChange={(event) =>
                  handleInputChange("birthDate", event.target.value)
                }
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
              padding="8px"
            >
              <TextField
                select
                margin="dense"
                label="Giới tính"
                fullWidth
                variant="outlined"
                size="small"
                value={formData.gender}
                error={!!formErrors.gender}
                helperText={formErrors.gender}
                onChange={(event) =>
                  handleInputChange("gender", event.target.value)
                }
              >
                <MenuItem value="Nam">Nam</MenuItem>
                <MenuItem value="Nữ">Nữ</MenuItem>
              </TextField>
              <TextField
                margin="dense"
                label="Số điện thoại"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.phoneNumber}
                helperText={formErrors.phoneNumber}
                value={formData.phoneNumber}
                onChange={(event) =>
                  handleInputChange("phoneNumber", event.target.value)
                }
              />
            </Box>
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
              padding="8px"
            >
              <TextField
                select
                margin="dense"
                label="Vai trò"
                fullWidth
                required
                variant="outlined"
                size="small"
                error={!!formErrors.roleId}
                helperText={formErrors.roleId}
                value={formData.roleId}
                onChange={(event) =>
                  handleInputChange("roleId", event.target.value)
                }
              >
                {[
                  { id: "R1", name: "Admin" },
                  { id: "R2", name: "Hotel" },
                  { id: "R3", name: "User" },
                ].map((role) => (
                  <MenuItem key={role.name} value={role.id}>
                    {role.name}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                label="Địa chỉ"
                fullWidth
                required
                variant="outlined"
                size="small"
                error={!!formErrors.address}
                helperText={formErrors.address}
                value={formData.address}
                onChange={(event) =>
                  handleInputChange("address", event.target.value)
                }
              />
            </Box>
          </Box>
        </Box>
        <Box display="flex" justifyContent="flex-end" padding="10px">
          <Button
            onClick={handleSave}
            color="primary"
            variant="contained"
            sx={{
              width: "100px",
              backgroundColor: "#1976d2",
              color: "#ffffff",
              "&:hover": {
                backgroundColor: "#1565c0",
              },
            }}
          >
            Lưu
          </Button>
        </Box>
      </DialogContent>
      {openSnackbar && (
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={() => setOpenSnackbar(false)}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={() => setOpenSnackbar(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      )}
    </Dialog>
  );
};

export default CreateEditPopup;
