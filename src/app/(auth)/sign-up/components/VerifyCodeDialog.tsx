"use client";
import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { MuiOtpInput } from "mui-one-time-password-input";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import apiService from "@/services/api";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/components/CustomSnackbar";

interface VerifyCodeDialogProps {
  open: boolean;
  email: string;
  otp_token: string;
  onClose: () => void;
}

interface SignUpResponse {
  otp_token: string;
  status: string;
  code: number;
  message: string;
  success: boolean;
}

const VerifyCodeDialog: React.FC<VerifyCodeDialogProps> = ({
  open,
  email,
  otp_token,
  onClose,
}) => {
  const [otp, setOtp] = useState<string>("");
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const router = useRouter();

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleOtpChange = (value: string) => {
    setOtp(value);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      const resp = await apiService.post<SignUpResponse>(
        `/user/verify-account/${otp_token}`,
        {
          otpCode: otp,
        }
      );
      if (resp.data.status === "OK") {
        setSnackbarSeverity("success");
        setSnackbarMessage("Đăng ký thành công");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (resp.data.status === "ERR") {
        setOtp("");
        setSnackbarSeverity("error");
        setSnackbarMessage("Vui lòng nhập OTP");
      } else if (resp.data.status === "ERR1") {
        setOtp("");
        setSnackbarSeverity("error");
        setSnackbarMessage("OTP không chính xác");
      } else if (resp.data.status === "ERROR") {
        setOtp("");
        setSnackbarSeverity("error");
        setSnackbarMessage("OTP đã hết hạn");
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Đã xảy ra lỗi");
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Đã xảy ra lỗi: " + error.message);
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage("Đã xảy ra lỗi không xác định");
      }
    }
    setOpenSnackbar(true);
  };

  const handleBackClick = () => {
    setOtp("");
    setOpenSnackbar(false);
    setSnackbarMessage("");
    setSnackbarSeverity("success");
    onClose();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={(_, reason) => {
          if (reason === "backdropClick") {
            return;
          }
          handleBackClick();
        }}
        className="flex justify-center items-center"
        PaperProps={{
          style: {
            maxWidth: "700px",
            width: "100%",
          },
        }}
      >
        <div className="w-full max-w-[700px]">
          <DialogTitle>
            <div className="flex items-center justify-between w-full">
              <IconButton onClick={handleBackClick} className="mr-2">
                <ArrowBackIcon />
              </IconButton>
              <span className="text-2xl text-center text-black font-bold flex-grow">
                Nhập mã OTP
              </span>
              <div className="mr-2"></div>
            </div>
          </DialogTitle>
          <DialogContent className="w-full flex flex-col space-y-4 items-center">
            <span className="text-center text-gray-500">
              Mã OTP đã được gửi đến Email:
              <span className="font-bold text-black"> {email}</span>
            </span>
            <MuiOtpInput
              value={otp}
              onChange={handleOtpChange}
              length={6}
              autoFocus
              validateChar={() => true}
              className="flex space-x-2"
              sx={{
                "& .MuiInputBase-input": {
                  backgroundColor: "#E5E7EB",
                  textAlign: "center",
                  borderRadius: "0.375rem",
                  border: "none",
                  fontSize: "32px",
                  "&:focus": {
                    outline: "none",
                    boxShadow: "0 0 0 2px #3B82F6",
                  },
                },
              }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              className="w-full text-white bg-blue-500 hover:bg-blue-600 normal-case rounded-lg"
            >
              Xác nhận
            </Button>
          </DialogContent>
          <DialogActions className="justify-center"></DialogActions>
        </div>
      </Dialog>

      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </>
  );
};

export default VerifyCodeDialog;
