"use client";
import React, { useEffect, useState } from "react";
import { TextField, Button, Avatar, Box } from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import BreadcrumbsNav from "@/app/info/components/BreadcrumbsNav";
import Sidebar from "@/app/info/components/Sidebar";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";

interface Profile {
  image?: string;
  email?: string;
  fullname?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
}
const UserProfile = () => {
  const [editingField, setEditingField] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [profile, setProfile] = useState<Profile>({
    image: "",
    fullname: "",
    email: "",
    phoneNumber: "",
    birthDate: "",
    gender: "",
    address: "",
  });
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const res = await apiService.get<ApiResponse<Profile>>(
          `/user/${userId}`
        );
        setProfile(res.data.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId]);

  const handleInputChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  const validatePhoneNumber = (phone: string) => {
    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(phone)) {
      return "Số điện thoại phải bao gồm 10 chữ số.";
    }
    return "";
  };

  const handleEditClick = (field: string) => {
    if (field !== "email") {
      setEditingField(field);
    }
  };

  const handleSaveClick = async () => {
    let isValid = true;
    if (editingField === "phone") {
      const phoneError = validatePhoneNumber(profile.phoneNumber || "");
      if (phoneError) {
        setErrors((prev) => ({ ...prev, phoneNumber: phoneError }));
        isValid = false;
      }
    }

    if (isValid) {
      try {
        const input_data = new FormData();
        const fields: (keyof typeof profile)[] = [
          "email",
          "fullname",
          "gender",
          "birthDate",
          "phoneNumber",
          "address",
        ];

        fields.forEach((field) => {
          if (profile[field]) input_data.append(field, profile[field]);
        });

        await apiService.put(`user/${userId}`, input_data);
        //console.log("Response:", resp);
      } catch (error) {
        console.log("Error updating profile:", error);
      }
      setEditingField(null);
    }
  };

  const handleCancelClick = () => {
    setEditingField(null);
  };

  const handleUpdateAvatar = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile((prevData) => ({
          ...prevData,
          image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
      const formData = new FormData();
      formData.append("image", file);

      try {
        const resp = await apiService.put(`user/${userId}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
      } catch (error) {
        console.log("Error updating profile:", error);
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
            {/* Avatar and Title */}
            <div className="w-full border-b-8 border-gray-300 pb-4 mb-6">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-3xl font-bold text-blue-900">
                    Thông tin cá nhân
                  </h2>
                  <p className="text-gray-600">
                    Lưu thông tin của Quý khách để đặt dịch vụ nhanh hơn
                  </p>
                </div>
                <div className="relative group">
                  <Avatar
                    src={profile.image}
                    sx={{ width: 60, height: 60 }}
                    className="border border-gray-300"
                  />
                  <label
                    htmlFor="upload-avatar"
                    className="absolute inset-0 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                  >
                    <CameraAlt className="text-gray-400" />
                  </label>
                  <input
                    accept="image/*"
                    style={{ display: "none" }}
                    id="upload-avatar"
                    type="file"
                    onChange={handleUpdateAvatar}
                  />
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="space-y-4">
              {/* Name */}
              <div className="grid grid-cols-12 items-center py-4 border-b border-gray-300">
                <div className="text-gray-700 col-span-3 justify-self-start">
                  Họ tên
                </div>
                <div className="col-span-7 pl-8">
                  {editingField === "fullname" ? (
                    <TextField
                      name="fullname"
                      value={profile.fullname}
                      onChange={handleInputChange}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    <div>{profile.fullname}</div>
                  )}
                </div>
                <div className="col-span-2 ml-8 flex flex-col items-center gap-2">
                  {editingField === "fullname" ? (
                    <>
                      <Button
                        size="small"
                        onClick={handleCancelClick}
                        sx={{
                          color: "#007BFF",
                          textTransform: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        size="small"
                        onClick={handleSaveClick}
                        sx={{
                          backgroundColor: "#00C1FF",
                          color: "white",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#009FCC" },
                        }}
                      >
                        Lưu
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => handleEditClick("fullname")}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="grid grid-cols-12 items-center py-4 border-b border-gray-300">
                <div className="text-gray-700 col-span-3 justify-self-start">
                  Địa chỉ email
                </div>
                <div className="col-span-7 pl-8">
                  <div>{profile.email}</div>
                </div>
              </div>

              {/* Phone */}
              <div className="grid grid-cols-12 items-center py-4 border-b border-gray-300">
                <div className="text-gray-700 col-span-3 justify-self-start">
                  Số điện thoại
                </div>
                <div className="col-span-7 pl-8">
                  {editingField === "phoneNumber" ? (
                    <TextField
                      name="phoneNumber"
                      value={profile.phoneNumber}
                      onChange={handleInputChange}
                      size="small"
                      fullWidth
                      error={Boolean(errors.phoneNumber)}
                      helperText={errors.phoneNumber}
                    />
                  ) : (
                    <div
                      className={`${
                        profile.phoneNumber ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {profile.phoneNumber || "Thêm số điện thoại của bạn"}
                    </div>
                  )}
                </div>
                <div className="col-span-2 ml-8 flex flex-col items-center gap-2">
                  {editingField === "phoneNumber" ? (
                    <>
                      <Button
                        size="small"
                        onClick={handleCancelClick}
                        sx={{
                          color: "#007BFF",
                          textTransform: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        size="small"
                        onClick={handleSaveClick}
                        sx={{
                          backgroundColor: "#00C1FF",
                          color: "white",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#009FCC" },
                        }}
                      >
                        Lưu
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => setEditingField("phoneNumber")}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>

              {/* BirthDate */}
              <div className="grid grid-cols-12 items-center py-4 border-b border-gray-300">
                <div className="text-gray-700 col-span-3 justify-self-start">
                  Ngày sinh
                </div>
                <div className="col-span-7 pl-8">
                  {editingField === "birthDate" ? (
                    <TextField
                      name="birthDate"
                      type="date"
                      value={profile.birthDate}
                      onChange={handleInputChange}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    <div
                      className={`${
                        profile.birthDate ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {profile.birthDate
                        ? profile.birthDate.split("-").reverse().join("-")
                        : "Nhập ngày sinh của bạn"}
                    </div>
                  )}
                </div>
                <div className="col-span-2 ml-8 flex flex-col items-center gap-2">
                  {editingField === "birthDate" ? (
                    <>
                      <Button
                        size="small"
                        onClick={handleCancelClick}
                        sx={{
                          color: "#007BFF",
                          textTransform: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        size="small"
                        onClick={handleSaveClick}
                        sx={{
                          backgroundColor: "#00C1FF",
                          color: "white",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#009FCC" },
                        }}
                      >
                        Lưu
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => handleEditClick("birthDate")}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div className="grid grid-cols-12 items-center py-4 border-b border-gray-300">
                <div className="text-gray-700 col-span-3 justify-self-start">
                  Giới tính
                </div>
                <div className="col-span-7 pl-8">
                  {editingField === "gender" ? (
                    <select
                      name="gender"
                      value={profile.gender}
                      onChange={handleInputChange}
                      className="w-full border border-gray-300 rounded-md px-2 py-1"
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  ) : (
                    <div
                      className={`${
                        profile.gender ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {profile.gender || "Chọn giới tính của bạn"}
                    </div>
                  )}
                </div>
                <div className="col-span-2 ml-8 flex flex-col items-center gap-2">
                  {editingField === "gender" ? (
                    <>
                      <Button
                        size="small"
                        onClick={handleCancelClick}
                        sx={{
                          color: "#007BFF",
                          textTransform: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        size="small"
                        onClick={handleSaveClick}
                        sx={{
                          backgroundColor: "#00C1FF",
                          color: "white",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#009FCC" },
                        }}
                      >
                        Lưu
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => handleEditClick("gender")}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-12 items-center py-4 border-b border-gray-300">
                <div className="text-gray-700 col-span-3 justify-self-start">
                  Địa chỉ
                </div>
                <div className="col-span-7 pl-8">
                  {editingField === "address" ? (
                    <TextField
                      name="address"
                      value={profile.address}
                      onChange={handleInputChange}
                      size="small"
                      fullWidth
                    />
                  ) : (
                    <div
                      className={`${
                        profile.address ? "text-black" : "text-gray-400"
                      }`}
                    >
                      {profile.address || "Nhập địa chỉ của bạn"}
                    </div>
                  )}
                </div>
                <div className="col-span-2 ml-8 flex flex-col items-center gap-2">
                  {editingField === "address" ? (
                    <>
                      <Button
                        size="small"
                        onClick={handleCancelClick}
                        sx={{
                          color: "#007BFF",
                          textTransform: "none",
                          "&:hover": { textDecoration: "underline" },
                        }}
                      >
                        Hủy
                      </Button>
                      <Button
                        size="small"
                        onClick={handleSaveClick}
                        sx={{
                          backgroundColor: "#00C1FF",
                          color: "white",
                          textTransform: "none",
                          "&:hover": { backgroundColor: "#009FCC" },
                        }}
                      >
                        Lưu
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="small"
                      onClick={() => handleEditClick("address")}
                    >
                      Chỉnh sửa
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
