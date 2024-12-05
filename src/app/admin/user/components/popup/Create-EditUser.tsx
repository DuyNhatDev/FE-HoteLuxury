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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import apiService from "@/services/api";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { UserProps } from "@/utils/interface/UserInterface";
import { validateForm } from "@/utils/validate/validate-form-user";
import { ApiResponse } from "@/utils/interface/ApiInterface";

interface CreateEditProps {
  open: boolean;
  onClose: () => void;
  id?: number;
  type: string;
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
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [hover, setHover] = useState(false);
  const [formData, setFormData] = useState<UserProps>({});
  const [formErrors, setFormErrors] = useState<{
    [key in keyof UserProps]?: string;
  }>({});

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
    const errors = validateForm(formData, type as "add" | "edit");
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
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

      const response = await apiService[method](url, input_data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      //console.log(error);
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
        image: userData.image
          ? `http://localhost:9000/uploads/${userData.image}`
          : "",
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
              marginTop="40px"
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
                        disabled={type === "edit"}
                        accept="image/*"
                        style={{ display: "none" }}
                        id="upload-avatar1"
                        type="file"
                        onChange={handleFileChange}
                      />
                      {/* <label htmlFor="upload-avatar1">
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
                      </label> */}
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
                  <div className="flex flex-col items-center justify-center">
                    <label
                      htmlFor="upload-avatar"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <IconButton component="span">
                        <AddAPhotoIcon
                          sx={{ fontSize: 25, color: "#727272" }}
                        />
                      </IconButton>
                      <Typography
                        align="center"
                        sx={{ fontSize: "14px", color: "#9e9e9e", mt: 1 }}
                      >
                        Tải ảnh lên
                      </Typography>
                    </label>
                  </div>
                </>
              )}
            </Box>
            <Typography
              align="center"
              sx={{ marginTop: "20px", fontSize: "20px", color: "#9e9e9e" }}
            >
              Ảnh đại diện
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
                disabled={type === "edit"}
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
                disabled={type === "edit"}
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
                disabled={type === "edit"}
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
                disabled={type === "edit"}
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
                  { id: "R1", name: "Quản trị viên" },
                  { id: "R2", name: "Quản lý khách sạn" },
                  { id: "R3", name: "Khách hàng" },
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
                disabled={type === "edit"}
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
      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default CreateEditPopup;
