import React from "react";
import { Snackbar, Alert, AlertTitle } from "@mui/material";

interface CustomSnackbarProps {
  open: boolean;
  onClose: () => void;
  severity: "success" | "error" | "info" | "warning";
  message: string;
}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({
  open,
  onClose,
  severity,
  message,
}) => {
  const title =
    severity === "success"
      ? "Success"
      : severity === "error"
      ? "Error"
      : severity === "info"
      ? "Info"
      : "Warning";
  return (
    <Snackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        <AlertTitle>{title}</AlertTitle>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default CustomSnackbar;
