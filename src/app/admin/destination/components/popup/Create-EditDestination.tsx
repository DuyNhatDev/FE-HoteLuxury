import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import apiService from "@/services/api";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { DestinationProps } from "@/utils/interface/DestinationInterface";
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
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");
  const [hover, setHover] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [formData, setFormData] = useState<DestinationProps>({
    locationName: "",
    locationImage: "",
  });

  const handleInputChange = (key: keyof DestinationProps, value: string) => {
    setFormData((prevData) => ({ ...prevData, [key]: value }));
    //setFormErrors((prevErrors) => ({ ...prevErrors, [key]: "" }));
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
      locationName: "",
      locationImage: "",
    });
    //setFormErrors({});
    setSelectedFile(null);
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarSeverity("success");
  };

  const handleSave = async () => {
    if (!formData.locationName.trim()) {
      setError(true);
      return;
    }
    const input_data = new FormData();
    if (formData.locationName)
      input_data.append("locationName", formData.locationName);
    if (selectedFile) input_data.append("locationImage", selectedFile);
    try {
      const url = type === "add" ? "/location" : `location/${id}`;
      const method = type === "add" ? "post" : "put";
      const successMessage =
        type === "add"
          ? "Thêm địa điển thành công"
          : "Cập nhật địa điểm thành công";
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
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  const fetchData = async () => {
    try {
      const resp = await apiService.get<ApiResponse<DestinationProps>>(
        `location/${id}`
      );
      const destinationData = resp.data.data;
      const updatedFormData = {
        locationName: destinationData.locationName || "",
        locationImage: destinationData.locationImage
          ? `https://be-hote-luxury.vercel.app/uploads/${destinationData.locationImage}`
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
          locationImage: reader.result as string,
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
      maxWidth="md"
      PaperProps={{
        style: {
          width: "700px",
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
          flexDirection="column"
          alignItems="center"
          border="1px solid #e0e0e0"
          borderRadius="10px"
          boxShadow="0px 2px 8px rgba(0, 0, 0, 0.05)"
          padding="16px"
          width="100%"
          gap="20px"
        >
          <TextField
            margin="dense"
            label="Tên địa điểm"
            fullWidth
            variant="outlined"
            size="small"
            required
            value={formData.locationName}
            error={error}
            helperText={error ? "Vui lòng nhập tên địa điểm" : ""}
            onChange={(event) =>
              handleInputChange("locationName", event.target.value)
            }
          />
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            width="100%"
            height={400}
            border="1px solid #e0e0e0"
            borderRadius="10px"
            boxShadow="0px 2px 8px rgba(0, 0, 0, 0.05)"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              border="1px dashed #9e9e9e"
              borderRadius="10px"
              width="100%"
              height="100%"
              sx={{
                backgroundColor: "#f4f6f8",
                transition: "0.3s",
                "&:hover": {
                  borderColor: "#333",
                },
              }}
            >
              {formData.locationImage ? (
                <Box
                  position="relative"
                  width="100%"
                  height="100%"
                  onMouseEnter={() => setHover(true)}
                  onMouseLeave={() => setHover(false)}
                >
                  <img
                    src={formData.locationImage}
                    alt="location"
                    style={{
                      width: "100%",
                      height: "100%",
                      borderRadius: "10px",
                      objectFit: "cover",
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
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
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
                    Tải ảnh lên
                  </Typography>
                </>
              )}
            </Box>
          </Box>
        </Box>

        {/* Action Button */}
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
