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
  Autocomplete,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import apiService from "@/services/api";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { User, UserProps } from "@/utils/interface/UserInterface";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { HotelProps } from "@/utils/interface/HotelInterface";
import { validateForm } from "@/utils/validate/validate-form-hotel";
import { Destination } from "@/utils/interface/DestinationInterface";
import RichTextEditor from "@/app/components/RichTextEditor";

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [hover, setHover] = useState(false);
  const [formData, setFormData] = useState<HotelProps>({});
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Destination[]>([]);
  const [formErrors, setFormErrors] = useState<{
    [key in keyof HotelProps]?: string;
  }>({});

  const handleInputChange = (key: keyof HotelProps, value: string | number) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  useEffect(() => {
    fetchLocation();
    fetchUser();
  }, []);

  useEffect(() => {
    //console.log("Data", formData);
  }, [formData]);

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
      hotelName: "",
      hotelType: "",
      hotelPhoneNumber: "",
      hotelAddress: "",
      hotelDescription: "",
      hotelImage: "",
      hotelStar: undefined,
      userId: undefined,
      locationId: undefined,
    });
    setFormErrors({});
    setSelectedFile(null);
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
      "hotelName",
      "hotelType",
      "hotelPhoneNumber",
      "hotelAddress",
      "hotelDescription",
      "hotelStar",
      "locationId",
      "userId",
    ];

    fields.forEach((field) => {
      if (formData[field]) {
        input_data.append(field, String(formData[field]));
      }
    });
    if (selectedFile) {
      input_data.append("hotelImage", selectedFile);
    }

    // input_data.forEach((value, key) => {
    //   console.log(`${key}: ${value}`);
    // });
    try {
      const url = type === "add" ? "/hotel" : `hotel/${id}`;
      const method = type === "add" ? "post" : "put";
      const successMessage =
        type === "add" ? "Thêm hotel thành công" : "Cập nhật hotel thành công";
      const errorMessage =
        type === "add" ? "Thêm thất bại" : "Cập nhật thất bại";

      const response = await apiService[method](url, input_data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      //const response = await apiService[method](url, input_data);
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
      console.log(error);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const fetchLocation = async () => {
    try {
      const resp = await apiService.get<ApiResponse<Destination[]>>(
        "/location"
      );
      if (resp.data.data) {
        setLocations(resp.data.data);
      } else {
        setLocations([]);
      }
    } catch (error) {}
  };

  const fetchUser = async () => {
    try {
      const resp = await apiService.get<ApiResponse<User[]>>(
        "/user/hotel-manager"
      );
      if (resp.data.data) {
        setUsers(resp.data.data);
      } else {
        setUsers([]);
      }
    } catch (error) {}
  };

  const fetchData = async () => {
    try {
      const res = await apiService.get<ApiResponse<HotelProps>>(`hotel/${id}`);
      const hotelData = res.data.data;
      const updatedFormData = {
        hotelName: hotelData.hotelName || "",
        hotelType: hotelData.hotelType || "",
        hotelPhoneNumber: hotelData.hotelPhoneNumber || "",
        hotelAddress: hotelData.hotelAddress || "",
        hotelDescription: hotelData.hotelDescription || "",
        hotelStar: hotelData.hotelStar || undefined,
        userId: hotelData.userId || undefined,
        locationId: hotelData.locationId || undefined,
        hotelImage: hotelData.hotelImage
          ? `https://be-hote-luxury.vercel.app/uploads/${hotelData.hotelImage}`
          : "",
      };
      setFormData((prevFormData) => ({ ...prevFormData, ...updatedFormData }));
    } catch (error) {
      console.log(error);
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
          hotelImage: reader.result as string,
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

  const handleDescriptionChange = (newDescription: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      hotelDescription: newDescription,
    }));
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      PaperProps={{
        style: {
          width: "900px",
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
        <Box display="flex" flexDirection="column" gap="20px">
          {/* Right Side - Form Fields */}
          <Box
            display="flex"
            flexDirection="column"
            width="100%"
            border="1px solid #e0e0e0"
            borderRadius="10px"
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.05)"
            padding="16px"
          >
            {/* Form Fields */}
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
            >
              <TextField
                margin="dense"
                label="Tên khách sạn"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.hotelName}
                helperText={formErrors.hotelName}
                value={formData.hotelName}
                onChange={(event) =>
                  handleInputChange("hotelName", event.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
              <Autocomplete
                options={users}
                getOptionLabel={(option: User) => option.fullname || ""}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Tài khoản người dùng"
                    variant="outlined"
                    margin="dense"
                    size="small"
                    required
                    error={!!formErrors.userId}
                    helperText={formErrors.userId}
                  />
                )}
                value={
                  users.find((user) => user.userId === formData.userId) || null
                }
                onChange={(event, newValue) => {
                  handleInputChange("userId", newValue ? newValue.userId : "");
                }}
              />
            </Box>

            {/* Additional Form Fields */}
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
            >
              <TextField
                select
                margin="dense"
                label="Loại khách sạn"
                fullWidth
                required
                variant="outlined"
                size="small"
                error={!!formErrors.hotelType}
                helperText={formErrors.hotelType}
                value={formData.hotelType}
                onChange={(event) =>
                  handleInputChange("hotelType", event.target.value)
                }
              >
                {[
                  { key: "Khách sạn", value: "Khách sạn" },
                  { key: "Khu nghỉ dưỡng", value: "Khu nghỉ dưỡng" },
                  { key: "Biệt thự", value: "Biệt thự" },
                  //{ key: "Du thuyền", value: "Du thuyền" },
                  { key: "Căn hộ", value: "Căn hộ" },
                  { key: "Nhà nghỉ", value: "Nhà nghỉ" },
                ].map((type) => (
                  <MenuItem key={type.key} value={type.value}>
                    {type.key}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                margin="dense"
                label="Số điện thoại"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.hotelPhoneNumber}
                helperText={formErrors.hotelPhoneNumber}
                value={formData.hotelPhoneNumber}
                onChange={(event) =>
                  handleInputChange("hotelPhoneNumber", event.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Other Form Fields */}
            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
            >
              <Autocomplete
                options={locations}
                getOptionLabel={(option: Destination) => option.locationName}
                fullWidth
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Địa điểm"
                    variant="outlined"
                    margin="dense"
                    size="small"
                    error={!!formErrors.locationId}
                    helperText={formErrors.locationId}
                    required
                  />
                )}
                value={
                  locations.find(
                    (location) => location.locationId === formData.locationId
                  ) || null
                }
                onChange={(event, newValue) => {
                  handleInputChange(
                    "locationId",
                    newValue ? newValue.locationId : ""
                  );
                }}
              />

              <TextField
                select
                margin="dense"
                label="Số sao"
                fullWidth
                required
                variant="outlined"
                size="small"
                error={!!formErrors.hotelStar}
                helperText={formErrors.hotelStar}
                value={formData.hotelStar || ""}
                onChange={(event) =>
                  handleInputChange(
                    "hotelStar",
                    parseInt(event.target.value, 10)
                  )
                }
              >
                {[
                  { key: "⭐⭐⭐⭐⭐", value: 5 },
                  { key: "⭐⭐⭐⭐", value: 4 },
                  { key: "⭐⭐⭐", value: 3 },
                  { key: "⭐⭐", value: 2 },
                  { key: "⭐", value: 1 },
                ].map((star) => (
                  <MenuItem key={star.key} value={star.value}>
                    {star.key}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box
              display="flex"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
            >
              <TextField
                margin="dense"
                label="Địa chỉ"
                fullWidth
                required
                variant="outlined"
                size="small"
                error={!!formErrors.hotelAddress}
                helperText={formErrors.hotelAddress}
                value={formData.hotelAddress}
                onChange={(event) =>
                  handleInputChange("hotelAddress", event.target.value)
                }
                InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Description Editor */}
            <Box marginBottom="5px">
              <RichTextEditor
                value={formData.hotelDescription || ""}
                onChange={handleDescriptionChange}
              />
            </Box>
          </Box>

          {/* Moved Image Upload Section */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            height="480px"
            border="1px solid #e0e0e0"
            borderRadius="10px"
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.05)"
            padding="16px"
          >
            <label
              htmlFor="upload-avatar"
              style={{ width: "100%", height: "100%", cursor: "pointer" }}
            >
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                border="1px dashed #9e9e9e"
                borderRadius="10px"
                width="100%"
                height="450px"
                sx={{
                  backgroundColor: "#f4f6f8",
                  transition: "0.3s",
                  "&:hover": {
                    borderColor: "#333",
                  },
                }}
              >
                {formData.hotelImage ? (
                  <Box
                    position="relative"
                    width="100%"
                    height="100%"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    <img
                      src={formData.hotelImage}
                      alt="hotel"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "10px",
                        transition: "0.3s",
                        objectFit: "cover",
                      }}
                    />
                    {hover && (
                      <IconButton
                        component="span"
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          backgroundColor: "rgba(255, 255, 255, 0.7)",
                          "&:hover": {
                            backgroundColor: "#f0f0f0",
                          },
                        }}
                      >
                        <AddAPhotoIcon sx={{ fontSize: 35, color: "#333" }} />
                      </IconButton>
                    )}
                  </Box>
                ) : (
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                  >
                    <IconButton component="span">
                      <AddAPhotoIcon sx={{ fontSize: 35, color: "#727272" }} />
                    </IconButton>
                    <Typography
                      align="center"
                      sx={{ fontSize: "14px", color: "#9e9e9e", mt: 1 }}
                    >
                      Tải ảnh lên
                    </Typography>
                  </Box>
                )}
              </Box>
            </label>
            <input
              accept="image/*"
              style={{ display: "none" }}
              id="upload-avatar"
              type="file"
              onChange={handleFileChange}
            />
            <Typography
              align="center"
              sx={{ marginTop: "20px", fontSize: "20px", color: "#9e9e9e" }}
            >
              Ảnh khách sạn
            </Typography>
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
