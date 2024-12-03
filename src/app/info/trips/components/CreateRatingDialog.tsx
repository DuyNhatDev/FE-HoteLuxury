import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Rating,
  Box,
  Typography,
} from "@mui/material";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import apiService from "@/services/api";
import dayjs from "dayjs";

interface CreateRatingProps {
  open: boolean;
  onClose: () => void;
  bookingId?: number;
  hotelId?: number;
}

const CreateRatingDialog: React.FC<CreateRatingProps> = ({
  open,
  onClose,
  hotelId,
  bookingId,
}) => {
  const [rating, setRating] = useState<number | null>(5);
  const [description, setDescription] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleSubmit = async () => {
    try {
      const score = (rating || 0) * 2;
      const currentDate = dayjs().format("YYYY-MM-DD");
      const resp = await apiService.post(`/rating/?bookingId=${bookingId}`, {
        hotelId: hotelId,
        ratingStar: score,
        ratingDescription: description,
        ratingDate: currentDate,
      });
      if (resp.status === 200) {
        setSnackbarSeverity("success");
        setSnackbarMessage("Thêm đánh giá thành công");
        setOpenSnackbar(true);
        setTimeout(() => {
          onClose();
          setOpenSnackbar(false);
        }, 1000);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Đã xảy ra lỗi");
        setOpenSnackbar(true);
      }
    } catch (error: any) {
      console.log(error);
      setSnackbarSeverity("error");
      setSnackbarMessage(error.message);
      setOpenSnackbar(true);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      sx={{ "& .MuiDialog-paper": { height: "70vh", maxHeight: "90vh" } }}
    >
      <DialogTitle
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          fontSize: "1.8rem",
        }}
      >
        Đánh giá
      </DialogTitle>
      <DialogContent
        sx={{ overflowX: "hidden", paddingBottom: 0, maxHeight: "400px" }}
      >
        <Box sx={{ mb: 3, width: "100%" }}>
          <Typography
            component="legend"
            sx={{
              fontSize: "1rem",
              fontWeight: "medium",
              mb: 1,
              textAlign: "center",
            }}
          >
            Chọn số điểm (0 - 10):
          </Typography>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <Rating
              value={rating}
              onChange={(event, newValue) => setRating(newValue)}
              max={5}
              precision={0.5}
              size="large"
              sx={{
                "& .MuiRating-iconFilled": { color: "#fcd34d" },
                "& .MuiRating-iconHover": { color: "#fbbf24" },
              }}
            />
            <Typography sx={{ mt: 1, fontWeight: "medium" }}>
              Số điểm: {(rating || 0) * 2}
            </Typography>
          </Box>
        </Box>
        <TextField
          label="Mô tả"
          placeholder="Nhập mô tả của bạn ở đây"
          multiline
          rows={8}
          fullWidth
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "8px",
              "& fieldset": {
                borderColor: "#d1d5db",
              },
              "&:hover fieldset": {
                borderColor: "#6366f1",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6366f1",
              },
            },
          }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: "flex-end", paddingRight: 4 }}>
        <Button
          onClick={onClose}
          variant="contained"
          className="bg-red-500 hover:bg-red-600 text-white font-bold mr-2"
        >
          Hủy
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{
            fontWeight: "bold",
            textTransform: "none",
            backgroundColor: "#6366f1",
            "&:hover": { backgroundColor: "#4f46e5" },
          }}
        >
          Gửi Đánh Giá
        </Button>
      </DialogActions>
      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </Dialog>
  );
};

export default CreateRatingDialog;
