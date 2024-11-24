"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  ImageList,
  ImageListItem,
  ImageListItemBar,
} from "@mui/material";
import Image from "next/image";
import { Destination } from "@/utils/interface/DestinationInterface";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { useRouter } from "next/navigation";

const HomePage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const router = useRouter();
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const resp = await apiService.get<ApiResponse<Destination[]>>(
          "/location"
        );
        //console.log(resp.data.data);
        setDestinations(resp.data.data);
      } catch (error) {
        console.log("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  const convertToSlug = (text: string): string => {
    return text
      .replace(/á|à|ả|ã|ạ|ă|ắ|ằ|ẳ|ẵ|ặ|â|ấ|ầ|ẩ|ẫ|ậ/g, "a")
      .replace(/Á|À|Ả|Ã|Ạ|Ă|Ắ|Ằ|Ẳ|Ẵ|Ặ|Â|Ấ|Ầ|Ẩ|Ẫ|Ậ/g, "A")
      .replace(/é|è|ẻ|ẽ|ẹ|ê|ế|ề|ể|ễ|ệ/g, "e")
      .replace(/É|È|Ẻ|Ẽ|Ẹ|Ê|Ế|Ề|Ể|Ễ|Ệ/g, "E")
      .replace(/í|ì|ỉ|ĩ|ị/g, "i")
      .replace(/Í|Ì|Ỉ|Ĩ|Ị/g, "I")
      .replace(/ó|ò|ỏ|õ|ọ|ô|ố|ồ|ổ|ỗ|ộ|ơ|ớ|ờ|ở|ỡ|ợ/g, "o")
      .replace(/Ó|Ò|Ỏ|Õ|Ọ|Ô|Ố|Ồ|Ổ|Ỗ|Ộ|Ơ|Ớ|Ờ|Ở|Ỡ|Ợ/g, "O")
      .replace(/ú|ù|ủ|ũ|ụ|ư|ứ|ừ|ử|ữ|ự/g, "u")
      .replace(/Ú|Ù|Ủ|Ũ|Ụ|Ư|Ứ|Ừ|Ử|Ữ|Ự/g, "U")
      .replace(/ý|ỳ|ỷ|ỹ|ỵ/g, "y")
      .replace(/Ý|Ỳ|Ỷ|Ỹ|Ỵ/g, "Y")
      .replace(/đ/g, "d")
      .replace(/Đ/g, "D")
      .replace(/[^a-zA-Z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase();
  };

  return (
    <div className="relative">
      {/* Hình nền */}
      <div className="relative h-[350px] w-full">
        <Image
          src="/images/home-bg.png"
          alt="Background"
          className="object-fill"
          fill
        />

        {/* Form tìm kiếm nằm giữa */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-11/12 max-w-xl bg-white shadow-lg rounded-md p-3">
            <form className="flex flex-col gap-4">
              {/* Thanh tìm kiếm Địa điểm */}
              <div className="w-full">
                <TextField
                  label="Địa điểm"
                  variant="outlined"
                  fullWidth
                  className="bg-white"
                />
              </div>

              {/* Thanh Ngày đến, Ngày đi, Số người và nút Tìm */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-grow sm:w-1/4">
                  <TextField
                    label="Ngày nhận phòng"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <div className="flex-grow sm:w-1/4">
                  <TextField
                    label="Ngày trả phòng"
                    type="date"
                    variant="outlined"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                {/* Nút Tìm */}
                <div className="flex-none">
                  <Button
                    variant="contained"
                    color="primary"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                  >
                    Tìm
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="container mx-auto py-8">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Địa điểm nổi bật
        </h2>
        <ImageList
          sx={{
            width: "100%",
            maxWidth: 900,
            height: "auto",
            margin: "0 auto",
          }}
          cols={3}
          gap={24}
        >
          {destinations.map((destination) => (
            <ImageListItem
              key={destination.locationId}
              onClick={() => {
                sessionStorage.setItem(
                  "locationId",
                  destination.locationId.toString()
                );
                router.push(
                  `/khach-san-${convertToSlug(destination.locationName)}`
                );
              }}
              style={{ cursor: "pointer" }}
            >
              <img
                src={`http://localhost:9000/uploads/${destination.locationImage}?w=400&h=400&fit=crop&auto=format`}
                srcSet={`http://localhost:9000/uploads/${destination.locationImage}?w=400&h=400&fit=crop&auto=format&dpr=2 2x`}
                alt={destination.locationName}
                loading="lazy"
                style={{ borderRadius: "16px" }} // Bo góc lớn hơn
              />
              <ImageListItemBar
                title={destination.locationName}
                position="below"
                sx={{
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: "1.2rem",
                }}
              />
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div>
  );
};

export default HomePage;
