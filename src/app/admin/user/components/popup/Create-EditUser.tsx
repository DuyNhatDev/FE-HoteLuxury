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
        console.log('id: ', id);
        fetchData();
      } else {
        resetData();
      }
    } else {
      resetData();
    }
  }, [open]);

  useEffect(() => {
  }, [formData]);

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
    if (!validateForm()) {
      return;
    }
    console.log("Form Data:", formData);
    const input_data = new FormData();
    if (formData.email) input_data.append("email", formData.email);
    if (formData.password) input_data.append("password", formData.password);
    if (formData.fullname) input_data.append("fullname", formData.fullname);
    if (formData.gender) input_data.append("gender", formData.gender);
    if (formData.birthDate) input_data.append("birthDate", formData.birthDate);
    if (formData.phoneNumber) input_data.append("phoneNumber", formData.phoneNumber);
    if (formData.address) input_data.append("address", formData.address);
    if (selectedFile) input_data.append("image", selectedFile);
    for (let pair of input_data.entries()) {
      console.log(pair[0] + ": " + pair[1]);
    }

    try {
      let response;
      if (type === "add") {
        response = await apiService.post("/user", input_data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setSnackbarSeverity("success");
        setSnackbarMessage("Thêm user thành công");
        setOpenSnackbar(true);
        setTimeout(() => {
          onClose();
          setOpenSnackbar(false);
        }, 1000);
      } else if (type === "edit") {
        response = await apiService.put(`user/${id}`, input_data, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        console.log("Response: ", response.data);
        console.log("Status: ", response.data.status);
        if (response.data.status==='OK'){
            setSnackbarSeverity("success");
            setSnackbarMessage("Cập nhật user thành công");
            setOpenSnackbar(true);
            setTimeout(() => {
              onClose();
              setOpenSnackbar(false);
            }, 1000);
        } 
      }
    } catch (error: any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const fetchData = async () => {
    try {
      const res = await apiService.get<UserProps>(`user/${id}`);
      const data = res.data.data;
      if (data.email) {
        setFormData((prevFormData) => ({ ...prevFormData, email: data.email }));
      }

      if (data.fullname) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          fullname: data.fullname,
        }));
      }
      if (data.gender) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          gender: data.gender,
        }));
      }
      if (data.birthDate) {
        const convertedBirthday = data.birthDate.split("T")[0];
        setFormData((prevFormData) => ({
          ...prevFormData,
          birthDate: convertedBirthday,
        }));
      }
      if (data.roleId) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          roleId: data.roleId,
        }));
      }
      if (data.phoneNumber) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          phoneNumber: data.phoneNumber,
        }));
      }
      if (data.address) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          address: data.address,
        }));
      }
      if (data.image) {
        setFormData((prevFormData) => ({
          ...prevFormData,
          image: `http://localhost:9000/uploads/${data.image}`,
        }));
      }
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
      PaperProps={{ style: { width: "1100px", position: "absolute" } }}
    >
      <DialogTitle>
        {type === "add" ? "Add New" : "Edit"}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          gap="10px"
        >
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="25%"
            height="340px"
            border="1px solid #eaeaea"
            borderRadius="10px"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px dashed grey"
              borderRadius="100%"
              width={180}
              height={180}
              marginTop="20px"
            >
              <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                bgcolor="#f4f6f8"
                borderRadius="100%"
                padding="10px"
                width={160}
                height={160}
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
                            style={{
                              position: "absolute",
                              bottom: "10px",
                              right: "10px",
                              backgroundColor: "#ffffff",
                            }}
                          >
                            <AddAPhotoIcon sx={{ fontSize: 25 }} />
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
                        <AddAPhotoIcon sx={{ fontSize: 25 }} />
                      </IconButton>
                    </label>
                    <Typography
                      align="center"
                      sx={{ fontSize: "14px", color: "#72808d" }}
                    >
                      Tải ảnh đại diện
                    </Typography>
                  </>
                )}
              </Box>
            </Box>
            <Typography
              align="center"
              sx={{ marginTop: "20px", fontSize: "14px", color: "#72808d" }}
            >
              *.jpeg, *.jpg, *.png.
              <br />
            </Typography>
          </Box>

          <Box
            display="flex"
            flexDirection="column"
            width="75%"
            border="1px solid #eaeaea"
            borderRadius="10px"
            padding="8px"
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
            sx={{ width: "100px" }}
          >
            Save
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
