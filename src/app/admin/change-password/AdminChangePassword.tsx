"use client";
import {
  Box,
  Button,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import React, { useState } from "react";
import apiService from "@/services/api";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { ChangePasswordResponse } from "@/utils/interface/ApiInterface";
import BreadcrumbsNav from "@/app/admin/components/BreadcrumbsNav";
import Sidebar from "@/app/admin/components/Sidebar";

const AdminChangePassword = () => {
  const [oldPassword, setOldPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);

  const [oldPasswordError, setOldPasswordError] = useState<string>("");
  const [newPasswordError, setNewPasswordError] = useState<string>("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<
    "success" | "error" | "info" | "warning"
  >("success");

  const handleTogglePasswordVisibility = (field: string) => {
    if (field === "old") setShowOldPassword(!showOldPassword);
    if (field === "new") setShowNewPassword(!showNewPassword);
    if (field === "confirm") setShowConfirmPassword(!showConfirmPassword);
  };

  const validatePasswords = () => {
    let isValid = true;

    if (!oldPassword) {
      setOldPasswordError("Vui lòng nhập mật khẩu cũ");
      isValid = false;
    } else {
      setOldPasswordError("");
    }

    if (newPassword.length < 6) {
      setNewPasswordError("Mật khẩu phải có tối thiểu 6 ký tự");
      isValid = false;
    } else {
      setNewPasswordError("");
    }

    if (confirmPassword !== newPassword) {
      setConfirmPasswordError("Mật khẩu không trùng khớp");
      isValid = false;
    } else {
      setConfirmPasswordError("");
    }

    return isValid;
  };

  const handleChangePassword = async () => {
    if (validatePasswords()) {
      const userId = localStorage.getItem("userId");
      try {
        const resp = await apiService.post<ChangePasswordResponse>(
          "/user/update-password",
          {
            userId: userId,
            oldPassword: oldPassword,
            newPassword: newPassword,
            confirmPassword: confirmPassword,
          }
        );
        if (resp.data.status === "OK") {
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Đổi mật khẩu thành công");
          setOldPassword("");
          setNewPassword("");
          setConfirmPassword("");
        } else {
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Mật khẩu cũ không chính xác");
        }
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <div className="py-8 px-48 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <BreadcrumbsNav />

      <div className="flex gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <Box>
            <Typography variant="h5" className="font-semibold mb-6 text-center">
              Đổi mật khẩu
            </Typography>
            <form className="space-y-6">
              <div>
                <Typography className="mb-2">Nhập mật khẩu cũ:</Typography>
                <TextField
                  fullWidth
                  type={showOldPassword ? "text" : "password"}
                  value={oldPassword}
                  onChange={(e) => {
                    setOldPassword(e.target.value);
                    if (e.target.value) {
                      setOldPasswordError("");
                    }
                  }}
                  error={!!oldPasswordError}
                  helperText={oldPasswordError}
                  variant="outlined"
                  placeholder="Nhập mật khẩu cũ"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility("old")}
                        >
                          {showOldPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div>
                <Typography className="mb-2">Nhập mật khẩu mới:</Typography>
                <TextField
                  fullWidth
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => {
                    setNewPassword(e.target.value);
                    if (e.target.value.length >= 6) {
                      setNewPasswordError("");
                    }
                  }}
                  error={!!newPasswordError}
                  helperText={newPasswordError}
                  variant="outlined"
                  placeholder="Nhập mật khẩu mới"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() => handleTogglePasswordVisibility("new")}
                        >
                          {showNewPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <div>
                <Typography className="mb-2">Xác nhận mật khẩu mới:</Typography>
                <TextField
                  fullWidth
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (e.target.value === newPassword) {
                      setConfirmPasswordError("");
                    }
                  }}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                  variant="outlined"
                  placeholder="Xác nhận mật khẩu mới"
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={() =>
                            handleTogglePasswordVisibility("confirm")
                          }
                        >
                          {showConfirmPassword ? (
                            <VisibilityOff />
                          ) : (
                            <Visibility />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </div>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                onClick={handleChangePassword}
              >
                Thay đổi
              </Button>
            </form>
          </Box>
        </div>
      </div>
      <CustomSnackbar
        open={openSnackbar}
        onClose={() => setOpenSnackbar(false)}
        severity={snackbarSeverity}
        message={snackbarMessage}
      />
    </div>
  );
};

export default AdminChangePassword;
