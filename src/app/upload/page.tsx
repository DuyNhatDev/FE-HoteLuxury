"use client";
import ImageDropzone from "@/app/components/ImageDropzone";
import React from "react";

const page = () => {
  const handleImageUpload = (images: File[]) => {
    console.log("Uploaded images:", images);
  };

  return (
    <div>
      <h1>Upload Images</h1>
      <ImageDropzone
        multiple={true} // Cho phép tải lên nhiều ảnh
        isPopup={true} // Hiển thị trực tiếp, không qua Dialog
        maxFileSize={10 * 1024 * 1024} // Kích thước tối đa mỗi file là 10MB
        maxFiles={10} // Tối đa 10 file ảnh
        onImageUpload={(images) => handleImageUpload(images as File[])} // Hàm callback khi upload xong
      />
    </div>
  );
};

export default page;
