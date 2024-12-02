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
  SelectChangeEvent,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import apiService from "@/services/api";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { Hotel, HotelProps } from "@/utils/interface/HotelInterface";
import RichTextEditor from "@/app/components/RichTextEditor";
import { RoomType, RoomTypeProps } from "@/utils/interface/RoomTypeInterface";
import { RoomProps, RoomUpdate } from "@/utils/interface/RoomInterface";
import { validateForm } from "@/utils/validate/validate-form-room";

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
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [formData, setFormData] = useState<RoomProps>({});
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [roomTypes, setRoomTypes] = useState<RoomType[]>([]);
  const [formErrors, setFormErrors] = useState<{
    [key in keyof RoomProps]?: string;
  }>({});

  const handleInputChange = (key: keyof RoomProps, value: string | number) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    setFormErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
    if (key === "hotelId" && typeof value === "number") {
      setRoomTypes([]);
      fetchRoomType(value);
    }
  };

  useEffect(() => {
    fetchHotel();
  }, []);

  // useEffect(() => {
  //   console.log("Data", formData);
  // }, [formData]);

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
      roomTypeId: undefined,
      roomNumber: "",
    });
    setFormErrors({});
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarSeverity("success");
  };

  const handleSave = async () => {
    const errors = validateForm(formData, type as "add" | "edit");
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const input_data = new FormData();
    const fields: (keyof typeof formData)[] = ["roomTypeId", "roomNumber"];

    fields.forEach((field) => {
      if (formData[field]) {
        input_data.append(field, String(formData[field]));
      }
    });

    try {
      const url = type === "add" ? "/room" : `room/${id}`;
      const method = type === "add" ? "post" : "put";
      const successMessage =
        type === "add"
          ? "Thêm loại phòng thành công"
          : "Cập nhật loại phòng thành công";
      const errorMessage =
        type === "add" ? "Thêm thất bại" : "Cập nhật thất bại";
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

  const fetchRoomType = async (hotelId: number) => {
    try {
      const resp = await apiService.get<ApiResponse<RoomType[]>>(
        `room-type/find-by-hotelId/${hotelId}`
      );
      if (resp.data.data) {
        setRoomTypes(resp.data.data);
      } else {
        setRoomTypes([]);
      }
    } catch (error) {}
  };

  const fetchData = async () => {
    try {
      const res = await apiService.get<ApiResponse<RoomUpdate>>(`room/${id}`);
      const room = res.data.data;
      const updatedFormData = {
        hotelId: room.roomTypeId.hotelId || undefined,
        roomTypeId: room.roomTypeId.roomTypeId || undefined,
        roomNumber: room.roomNumber || "",
      };
      setFormData((prevFormData) => ({ ...prevFormData, ...updatedFormData }));
      if (room.roomTypeId.hotelId) {
        await fetchRoomType(room.roomTypeId.hotelId);
      }
    } catch (error) {
      console.log(error);
      console.error("Error fetching data:", error);
    }
  };

  // const handleDescriptionChange = (newDescription: string) => {
  //   setFormData((prevFormData) => ({
  //     ...prevFormData,
  //     roomTypeDescription: newDescription,
  //   }));
  // };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: {
          width: "500px",
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
              flexDirection="column"
              justifyContent="space-between"
              gap="15px"
              marginBottom="5px"
            >
              <TextField
                select
                margin="dense"
                label="Khách sạn"
                fullWidth
                required
                variant="outlined"
                size="small"
                disabled={type === "edit"}
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

              <TextField
                select
                margin="dense"
                label="Loại phòng"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.roomTypeId}
                helperText={formErrors.roomTypeId}
                value={formData.roomTypeId || ""}
                onChange={(event) =>
                  handleInputChange("roomTypeId", event.target.value)
                }
              >
                {roomTypes.map((roomType: RoomType) => (
                  <MenuItem
                    key={roomType.roomTypeId}
                    value={roomType.roomTypeId}
                  >
                    {roomType.roomTypeName}
                  </MenuItem>
                ))}
              </TextField>

              <TextField
                margin="dense"
                label="Số phòng"
                fullWidth
                variant="outlined"
                size="small"
                required
                error={!!formErrors.roomNumber}
                helperText={formErrors.roomNumber}
                value={formData.roomNumber}
                onChange={(event) =>
                  handleInputChange("roomNumber", event.target.value)
                }
                InputLabelProps={{ shrink: true }}
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
