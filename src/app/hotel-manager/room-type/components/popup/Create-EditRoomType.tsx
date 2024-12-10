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
import apiService from "@/services/api";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { Hotel, HotelProps } from "@/utils/interface/HotelInterface";
import RichTextEditor from "@/app/components/RichTextEditor";
import { RoomTypeProps } from "@/utils/interface/RoomTypeInterface";
import { validateForm } from "@/utils/validate/validate-form-roomtype";

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
  const [formData, setFormData] = useState<RoomTypeProps>({});
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [formErrors, setFormErrors] = useState<{
    [key in keyof RoomTypeProps]?: string;
  }>({});

  const handleInputChange = (
    key: keyof RoomTypeProps,
    value: string | number
  ) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  //   useEffect(() => {
  //     console.log("Data", formData);
  //   }, [formData]);

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
      hotelId: undefined,
      roomTypeQuantity: undefined,
      roomTypeName: "",
      roomTypePrice: "",
      roomTypeDescription: "",
      maxPeople: undefined,
      roomTypeImage: "",
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
      "roomTypeName",
      "hotelId",
      "roomTypePrice",
      "roomTypeQuantity",
      "roomTypeDescription",
      "maxPeople",
    ];

    fields.forEach((field) => {
      if (formData[field]) {
        input_data.append(field, String(formData[field]));
      }
    });
    if (selectedFile) {
      input_data.append("roomTypeImage", selectedFile);
    }

    // // In ra dữ liệu trong FormData
    // console.log("FormData nội dung:");
    // input_data.forEach((value, key) => {
    //   console.log(`${key}:`, value);
    // });
    try {
      const url = type === "add" ? "/room-type" : `room-type/${id}`;
      const method = type === "add" ? "post" : "put";
      const successMessage =
        type === "add"
          ? "Thêm loại phòng thành công"
          : "Cập nhật loại phòng thành công";
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

  const fetchHotel = async () => {
    try {
      const resp = await apiService.get<ApiResponse<Hotel[]>>("/hotel");
      if (resp.data.data) {
        setHotels(resp.data.data);
      } else {
        setHotels([]);
      }
    } catch (error) {}
  };

  const fetchData = async () => {
    try {
      const res = await apiService.get<ApiResponse<RoomTypeProps>>(
        `room-type/by-hotel-manager/${id}`
      );
      const roomType = res.data.data;
      const updatedFormData = {
        roomTypeName: roomType.roomTypeName || "",
        hotelId: roomType.hotelId || undefined,
        roomTypePrice: roomType.roomTypePrice || "",
        roomTypeQuantity: roomType.roomTypeQuantity || undefined,
        roomTypeDescription: roomType.roomTypeDescription || "",
        maxPeople: roomType.maxPeople || undefined,
        roomTypeImage: roomType.roomTypeImage
          ? `http://localhost:9000/uploads/${roomType.roomTypeImage}`
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
          roomTypeImage: reader.result as string,
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
      roomTypeDescription: newDescription,
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
                label="Loại phòng"
                fullWidth
                type="email"
                variant="outlined"
                size="small"
                required
                error={!!formErrors.roomTypeName}
                helperText={formErrors.roomTypeName}
                value={formData.roomTypeName}
                onChange={(event) =>
                  handleInputChange("roomTypeName", event.target.value)
                }
                //InputLabelProps={{ shrink: true }}
              />
              <TextField
                select
                margin="dense"
                label="Khách sạn"
                fullWidth
                required
                variant="outlined"
                size="small"
                error={!!formErrors.hotelId}
                helperText={formErrors.hotelId}
                value={formData.hotelId || ""}
                onChange={(event) =>
                  handleInputChange("hotelId", event.target.value)
                }
              >
                {hotels.map((hotel: Hotel) => (
                  <MenuItem key={hotel.hotelId} value={hotel.hotelId}>
                    {hotel.hotelName}
                  </MenuItem>
                ))}
              </TextField>
            </Box>

            <Box
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              gap="50px"
              marginBottom="5px"
            >
              <TextField
                margin="dense"
                label="Số người"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.maxPeople}
                helperText={formErrors.maxPeople}
                value={formData.maxPeople}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^\d+$/.test(value) || value === "") {
                    handleInputChange(
                      "maxPeople",
                      value === "" ? "" : parseInt(value, 10)
                    );
                  }
                }}
                type="number"
                inputProps={{
                  min: 1,
                  step: 1,
                  shrink: true,
                }}
              />

              <TextField
                margin="dense"
                label="Số lượng phòng"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.roomTypeQuantity}
                helperText={formErrors.roomTypeQuantity}
                value={formData.roomTypeQuantity}
                onChange={(event) => {
                  const value = event.target.value;
                  if (/^\d+$/.test(value) || value === "") {
                    handleInputChange(
                      "roomTypeQuantity",
                      value === "" ? "" : parseInt(value, 10)
                    );
                  }
                }}
                type="number"
                inputProps={{
                  min: 1,
                  step: 1,
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
            >
              <TextField
                margin="dense"
                label="Giá"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.roomTypePrice}
                helperText={formErrors.roomTypePrice}
                value={formData.roomTypePrice}
                onChange={(event) =>
                  handleInputChange("roomTypePrice", event.target.value)
                }
                //InputLabelProps={{ shrink: true }}
              />
            </Box>

            {/* Description Editor */}
            <Box marginBottom="5px">
              <RichTextEditor
                value={formData.roomTypeDescription || ""}
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
                {formData.roomTypeImage ? (
                  <Box
                    position="relative"
                    width="100%"
                    height="100%"
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    <img
                      src={formData.roomTypeImage}
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
