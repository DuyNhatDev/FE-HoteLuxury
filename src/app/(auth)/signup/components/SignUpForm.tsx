"use client";
import React, { useState, MouseEvent } from 'react';
import Link from "next/link";
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useForm, SubmitHandler } from 'react-hook-form';
import { validateConfirmPassword, validateEmail, validateFullName, validatePassword } from '@/logic/validators';
import { Alert, Snackbar } from '@mui/material';
import VerifyCodeDialog from '@/app/(auth)/signup/components/VerifyCodeDialog';
import apiService from '@/services/api';

interface FormValues {
  fullname: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface SignUpResponse {
  otp_token: string;
  status: string;
  message: string;
}

const RegisterForm: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [emailForDialog, setEmailForDialog] = useState<string>('');
  const [otpToken, setOtpToken] = useState<string>('');

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormValues>();
  const password = watch("password");

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const resp = await apiService.post<SignUpResponse>("/user/sign-up", {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword
      });
      //console.log(resp.data);
      if (resp.data.status === 'OK') {
        setOtpToken(resp.data.otp_token);
        setEmailForDialog(data.email);
        handleOpenDialog();
        
      } else if (resp.data.status === 'ERR') {
        setShowSnackbar(true);
        setSnackbarSeverity('error');
        setSnackbarMessage('Email đã đăng ký');
      } else {
        setShowSnackbar(true);
        setSnackbarSeverity('error');
        setSnackbarMessage('Đã xảy ra lỗi');
      }
    } catch (error: unknown) {
        setShowSnackbar(true);
        if (error instanceof Error) {
          setSnackbarSeverity('error');
          setSnackbarMessage('Đã xảy ra lỗi: ' + error.message);
        } else {
          setSnackbarSeverity('error');
          setSnackbarMessage('Đã xảy ra lỗi không xác định');
        }
      }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <Label htmlFor="fullname" className="block text-lg font-medium text-gray-700">
          Họ và tên *
        </Label>
        <TextField
          id="fullName"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="Nhập họ và tên"
          {...register("fullname", {
            validate: validateFullName,
          })}
          error={!!errors.fullname}
          helperText={errors.fullname?.message}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="email" className="block text-lg font-medium text-gray-700">
          Email *
        </Label>
        <TextField
          id="email"
          type="text"
          fullWidth
          variant="outlined"
          placeholder="Nhập email"
          {...register("email", {
            validate: validateEmail,
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
      </div>

      <div className="mb-4">
        <Label htmlFor="password" className="block text-lg font-medium text-gray-700">
          Mật khẩu *
        </Label>
        <TextField
          id="password"
          type={showPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          placeholder="Nhập mật khẩu"
          {...register("password", {
            validate: validatePassword,
          })}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <div className="mb-6">
        <Label htmlFor="confirmPassword" className="block text-lg font-medium text-gray-700">
          Nhập lại mật khẩu *
        </Label>
        <TextField
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          fullWidth
          variant="outlined"
          placeholder="Nhập lại mật khẩu"
          {...register("confirmPassword", {
            validate: (value) => validateConfirmPassword(password, value),
          })}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle confirm password visibility"
                  onClick={handleClickShowConfirmPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </div>

      <Button
        type="submit"
        className="w-full bg-orange-500 text-white py-6 rounded-lg text-lg font-medium hover:bg-orange-600"
      >
        Đăng Ký
      </Button>

      <div className="mt-6 mb-1 flex items-center justify-center">
        <span className="text-gray-500 px-2">Bạn đã có tài khoản?</span>
        <Link href="http://localhost:3000/login" className="text-md text-indigo-600 hover:underline">
          Đăng nhập
        </Link>
      </div>
      <Snackbar
        open={showSnackbar}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <VerifyCodeDialog open={openDialog} email={emailForDialog} otp_token={otpToken} onClose={handleCloseDialog} />
    </form>
    
  );
};

export default RegisterForm;
