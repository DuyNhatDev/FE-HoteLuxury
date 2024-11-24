"use client";
import React, { useState, MouseEvent } from "react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import apiService from "@/services/api";
import { useForm, SubmitHandler } from "react-hook-form";
import { CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import CustomSnackbar from "@/app/components/CustomSnackbar";

interface LoginResponse {
  access_token: string;
  refresh_token: string;
  status: string;
  code: number;
  message: string;
  success: boolean;
  roleId: string;
}

interface FormValues {
  email: string;
  password: string;
}

const LoginForm: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string>("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const router = useRouter();

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    try {
      const resp = await apiService.post<LoginResponse>("/user/sign-in", {
        email: data.email,
        password: data.password,
      });
      if (resp.data.status === "OK") {
        localStorage.clear();
        const authData = {
          authorization: "Bearer " + resp.data.access_token,
          refresh_token: resp.data.refresh_token,
        };
        localStorage.setItem("authData", JSON.stringify(authData));
        setIsLoading(true);
        setSnackbarSeverity("success");
        setSnackbarMessage("Đăng nhập thành công");
        //console.log(resp.data.roleId);
        if (resp.data.roleId === "R1") {
          //router.push("/admin/dashboard");
          router.push("/admin/user");
        } else if (resp.data.roleId === "R2") {
          router.push("/hotel-management/hotel");
        } else {
          router.push("/home");
        }
      } else {
        setSnackbarSeverity("error");
        setSnackbarMessage(
          resp.data.status === "ERR2"
            ? "Email chưa được xác thực"
            : "Tài khoản hoặc mật khẩu không chính xác. Xin vui lòng thử lại"
        );
      }
    } catch (error: unknown) {
      setSnackbarSeverity("error");
      setSnackbarMessage(
        error instanceof Error
          ? "Đã xảy ra lỗi: " + error.message
          : "Đã xảy ra lỗi không xác định"
      );
    }
    setOpenSnackbar(true);
  };

  const handleLinkClick = (path: string) => {
    setIsLoading(true);
    router.push(path);
  };

  return (
    <>
      {isLoading && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-white bg-opacity-75 z-50">
          <CircularProgress size={80} />
          <p className="mt-4 text-lg font-medium text-gray-700">Đang tải...</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <Label
            htmlFor="email"
            className="block text-lg font-medium text-gray-700"
          >
            Email
          </Label>
          <TextField
            id="email"
            type="text"
            fullWidth
            variant="outlined"
            placeholder="Nhập email"
            {...register("email", {
              required: "Email không được để trống",
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />
        </div>
        <div className="mb-5">
          <Label
            htmlFor="password"
            className="block text-lg font-medium text-gray-700"
          >
            Mật khẩu
          </Label>
          <TextField
            id="password"
            type={showPassword ? "text" : "password"}
            fullWidth
            variant="outlined"
            placeholder="Nhập mật khẩu"
            {...register("password", {
              required: "Mật khẩu không được để trống",
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
        {/* <div className="flex justify-between items-center mb-4">
          <Link
            href="/forget-password"
            className="text-md text-indigo-600 hover:underline"
          >
            Quên mật khẩu?
          </Link>
          <Link
            href="/signup"
            className="text-md text-indigo-600 hover:underline"
          >
            Đăng ký tài khoản
          </Link>
        </div> */}
        <div className="flex justify-between items-center mb-4">
          <span
            onClick={() => handleLinkClick("/forget-password")}
            className="text-md text-indigo-600 hover:underline cursor-pointer"
          >
            Quên mật khẩu?
          </span>
          <span
            onClick={() => handleLinkClick("/signup")}
            className="text-md text-indigo-600 hover:underline cursor-pointer"
          >
            Đăng ký tài khoản
          </span>
        </div>
        <Button
          type="submit"
          className="w-full bg-orange-500 text-white py-6 rounded-lg text-lg font-medium hover:bg-orange-600"
          disabled={isLoading}
        >
          Đăng nhập
        </Button>

        <div className="my-6 flex items-center justify-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500">Hoặc</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        <div className="mt-6 flex justify-center gap-5">
          <Button
            type="button"
            className="flex items-center gap-4 w-full border border-gray-300 bg-white text-black text-lg py-2 rounded-lg hover:bg-blue-200"
          >
            <img
              src="/icons/google-icon.png"
              alt="Google"
              className="w-7 h-7"
            />
            Google
          </Button>
          <Button
            type="button"
            className="flex items-center gap-4 w-full border border-gray-300 bg-white text-black text-lg py-2 rounded-lg hover:bg-blue-200"
          >
            <img
              src="/icons/facebook-icon.png"
              alt="Facebook"
              className="w-7 h-7"
            />
            Facebook
          </Button>
        </div>
        <CustomSnackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          message={snackbarMessage}
        />
      </form>
    </>
  );
};

export default LoginForm;
