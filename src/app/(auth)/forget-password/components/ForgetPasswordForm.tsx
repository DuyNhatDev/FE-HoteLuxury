"use client";
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import TextField from '@mui/material/TextField';
import apiService from '@/services/api';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Alert, Snackbar } from '@mui/material';
import { validateEmail } from '@/logic/validators';

interface FormValues {
  email: string;
}

interface EmailResponse {
  message: string;
  status: string
}

const ForgetPassWordForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>();
  const [showSnackbar, setShowSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

  const handleCloseSnackbar = () => {
    setShowSnackbar(false);
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const resp = await apiService.post<EmailResponse>("/user/reset-password", {
        email: data.email,
      });
      if (resp.data.status === 'OK') {
        setSnackbarSeverity('success');
        setSnackbarMessage(`Đã gửi thông tin xác nhận đến email: ${data.email}`);
        setTimeout(() => {
          window.location.href = "http://localhost:3000/login";
        }, 2000);
      } else if (resp.data.status === 'ERR') {
        setSnackbarSeverity('error');
        setSnackbarMessage('Email chưa được đăng ký');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Đã xảy ra lỗi');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setSnackbarSeverity('error');
        setSnackbarMessage('Đã xảy ra lỗi: ' + error.message);
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Đã xảy ra lỗi không xác định');
      }
    }
    setShowSnackbar(true); 
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col items-center justify-center space-y-4">
        <span className="mb-5 text-center text-gray-500 text-lg">Vui lòng nhập email đã đăng ký tài khoản</span>
        <TextField
          id="email"
          type="text"
          label="Email"
          fullWidth
          variant="outlined"
          placeholder="Nhập email"
          {...register("email", {
            validate: validateEmail,
          })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />
        <Button
            color='primary'
            type="submit"
            className="w-full text-white bg-blue-500  hover:bg-blue-600 normal-case rounded-lg"
        >
        Gửi yêu cầu
      </Button>

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
    </form>
    
  );
};

export default ForgetPassWordForm;
