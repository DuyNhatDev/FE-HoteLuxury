"use client";
import { useAppContext } from "@/hooks/AppContext";
import apiService from "@/services/api";
import {
  ApiResponse,
  HotelRoomTypeResponse,
} from "@/utils/interface/ApiInterface";
import { HotelProps } from "@/utils/interface/HotelInterface";
import { RoomTypeProps } from "@/utils/interface/RoomTypeInterface";
import {
  Card,
  Button,
  Rating,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Modal,
  Box,
} from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import React, { useEffect, useRef, useState } from "react";
import DOMPurify from "dompurify";
import { usePathname, useRouter } from "next/navigation";
import { convertToSlug } from "@/utils/convert-fornat/convert-format";
import ListRating from "@/app/[hotel]/[hotel-detail]/components/ListRating";

const HotelDetailPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [hotel, setHotel] = useState<HotelProps>({});
  const [roomTypes, setRoomTypes] = useState<RoomTypeProps[]>([]);
  const { hotelId, dateRange, setRoomTypeId } = useAppContext();
  const [open, setOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const roomTableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const resp = await apiService.get<ApiResponse<HotelProps>>(
          `hotel/${hotelId}`
        );
        setHotel(resp.data.data);
      } catch (error) {
        console.log("Error fetching hotel:", error);
      }
    };
    fetchHotel();
  }, []);

  useEffect(() => {
    const fetchRoomTypes = async () => {
      try {
        const params = new URLSearchParams();
        if (hotelId) params.append("hotelId", hotelId);
        if (dateRange.dayStart) params.append("dayStart", dateRange.dayStart);
        if (dateRange.dayEnd) params.append("dayEnd", dateRange.dayEnd);
        const resp = await apiService.get<
          HotelRoomTypeResponse<RoomTypeProps[]>
        >(`room-type/available?${params.toString()}`);
        setRoomTypes([...resp.data.hotels].reverse());
      } catch (error) {
        console.log("Error fetching RoomType:", error);
      }
    };

    fetchRoomTypes();
  }, []);

  const handleOpen = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setOpen(true);
  };

  const handleScrollToRoomTable = () => {
    roomTableRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <IconButton
        className="!absolute !top-12 !left-0 !m-4 !pt-3 !z-10"
        onClick={() => {
          router.back();
        }}
      >
        <ArrowBackIcon />
      </IconButton>
      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6 max-w-7xl mx-auto">
        {/* Phần Mô Tả Khách Sạn */}
        <Card className="px-4 py-5 lg:col-span-2">
          <h3 className="text-lg font-semibold mb-2">Mô tả</h3>
          <div
            className="text-gray-600 text-sm leading-relaxed"
            // dangerouslySetInnerHTML={{
            //   __html: DOMPurify.sanitize(hotel.hotelDescription || ""),
            // }}
            dangerouslySetInnerHTML={{ __html: hotel.hotelDescription || "" }}
          ></div>
        </Card>

        {/* Phần Chi Tiết Khách Sạn */}
        <Card className="p-4 shadow-lg lg:col-span-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl text-blue-900 font-bold flex-grow">
              {hotel.hotelName}
            </h1>
            <Button
              variant="contained"
              className="!bg-orange-500 text-white mt-4 w-32"
              onClick={handleScrollToRoomTable}
            >
              Đặt ngay
            </Button>
          </div>

          <div className="flex items-center text-gray-600 mt-2">
            <LocationOnIcon className="mr-1 text-red-500" />
            <span>{hotel.hotelAddress}</span>
          </div>
          <div className="flex items-center text-gray-600 mt-2">
            <Rating value={hotel.hotelStar || 0} readOnly />
          </div>

          <div className="mt-6">
            <img
              src={hotel.hotelImage || ""}
              alt={hotel.hotelName}
              className="rounded-lg mt-4 shadow-md w-[800px] h-[500px] mx-auto object-cover"
            />
          </div>

          {/* Danh sách RoomTypes */}
          <div ref={roomTableRef} className="mt-8">
            <h2 className="text-lg font-bold mb-4">Danh sách phòng</h2>
            <TableContainer
              component={Paper}
              className="shadow-md !overflow-visible"
            >
              <Table className="border border-collapse">
                <TableHead>
                  <TableRow className="bg-gray-100">
                    <TableCell
                      align="center"
                      className="w-[200px] !font-bold !text-lg"
                    >
                      Loại phòng
                    </TableCell>
                    <TableCell
                      align="center"
                      className="w-[300px] !font-bold !text-lg"
                    >
                      Mô tả
                    </TableCell>
                    <TableCell
                      align="center"
                      className="w-[170px] !font-bold !text-lg"
                    >
                      Giá
                    </TableCell>
                    <TableCell
                      align="center"
                      className="w-[130px] !font-bold !text-lg"
                    >
                      Hành động
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {roomTypes.map((room) => (
                    <TableRow key={room.roomTypeId}>
                      {/* Loại phòng */}
                      <>
                        <TableCell align="center" className="w-[200px]">
                          <div className="flex flex-col items-center justify-center relative w-full h-full">
                            <h3 className="text-blue-700 text-lg font-bold leading-relaxed text-center mb-2">
                              {room.roomTypeName}
                            </h3>
                            <img
                              src={room.roomTypeImage || ""}
                              alt={room.roomTypeName}
                              className="rounded-lg w-[200px] h-[150px] object-cover cursor-pointer"
                              onClick={() =>
                                handleOpen(
                                  room.roomTypeImage || ""
                                )
                              }
                            />
                          </div>
                        </TableCell>

                        {/* Modal Hiển Thị Hình Ảnh */}
                        <Modal open={open} onClose={() => setOpen(false)}>
                          <Box
                            className="flex items-center justify-center"
                            sx={{
                              position: "absolute",
                              top: "50%",
                              left: "50%",
                              transform: "translate(-50%, -50%)",
                              bgcolor: "background.paper",
                              boxShadow: 24,
                              p: 4,
                            }}
                          >
                            <img
                              src={selectedImage}
                              alt="Chi tiết hình ảnh"
                              className="max-w-full max-h-[80vh] rounded-lg"
                            />
                          </Box>
                        </Modal>
                      </>

                      {/* Mô tả */}
                      <TableCell className="border border-gray-200 w-[300px]">
                        <div
                          className="text-gray-600 text-sm leading-relaxed"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                              room.roomTypeDescription || ""
                            ),
                          }}
                        ></div>
                      </TableCell>
                      {/* Giá */}
                      <TableCell
                        align="center"
                        className="p-1 border border-gray-200 w-[170px]"
                      >
                        {room.roomTypePrice !== undefined ? (
                          <span className="text-green-600 text-lg font-bold">
                            {`${new Intl.NumberFormat("vi-VN").format(
                              Number(room.roomTypePrice)
                            )} VND`}
                          </span>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </TableCell>
                      {/* Hành động */}
                      <TableCell
                        align="center"
                        className="border border-gray-200 w-[130px]"
                      >
                        <div className="flex flex-col items-center gap-2">
                          {/* IconButton Giỏ Hàng */}
                          {/* <IconButton
                            className="!text-blue-500"
                            aria-label="add to cart"
                            onClick={() => {
                              console.log("Thêm vào giỏ hàng");
                            }}
                          >
                            <AddShoppingCartIcon />
                          </IconButton> */}

                          {/* Nút Đặt Phòng */}
                          <Button
                            variant="contained"
                            size="small"
                            className="!bg-orange-500 text-white !p-3 !text-xs rounded-md"
                            onClick={() => {
                              if (localStorage.getItem("authData")) {
                                if (room.roomTypeId) {
                                  setRoomTypeId(room.roomTypeId.toString());
                                }
                                router.push(
                                  `/booking/${convertToSlug(
                                    hotel.hotelName || ""
                                  )}?id=${room.roomTypeId}`
                                );
                              } else {
                                localStorage.setItem("currentUrl", pathname);
                                router.push("/login");
                              }
                            }}
                          >
                            Đặt phòng
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          <div className="mt-8">
            <ListRating hotelName={hotel.hotelName} />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default HotelDetailPage;
