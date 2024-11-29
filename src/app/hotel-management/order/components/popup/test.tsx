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
import apiService from "@/services/api";
import { User, UserProps } from "@/utils/interface/UserInterface";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { HotelProps } from "@/utils/interface/HotelInterface";
import { Destination } from "@/utils/interface/DestinationInterface";

interface DetailBookingProps {
  open: boolean;
  onClose: () => void;
  id?: number;
  type: string;
}

const DetailBookingPopup: React.FC<DetailBookingProps> = ({
  open,
  onClose,
  id,
  type,
}) => {
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
    //console.log("Data", formData);
  }, [formData]);

  useEffect(() => {
    fetchData();
  }, [open]);

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
          ? `http://localhost:9000/uploads/${hotelData.hotelImage}`
          : "",
      };
      setFormData((prevFormData) => ({ ...prevFormData, ...updatedFormData }));
    } catch (error) {
      console.log(error);
      console.error("Error fetching data:", error);
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
                type="email"
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
            {/* <Box marginBottom="5px">
              <RichTextEditor
                value={formData.hotelDescription || ""}
                onChange={handleDescriptionChange}
              />
            </Box> */}
          </Box>

          {/* Moved Image Upload Section */}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default DetailBookingPopup;
