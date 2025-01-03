"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  TextField,
  TablePagination,
  Grid,
  Autocomplete,
  Button,
} from "@mui/material";
import QuizIcon from "@mui/icons-material/Quiz";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import PaymentIcon from "@mui/icons-material/Payment";
import apiService from "@/services/api";
import {
  confirmBooking,
  confirmPaymentBooking,
  refuseBooking,
} from "@/utils/notification/confirm-dialog";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { BookingProps, Filters, Row } from "@/utils/interface/BookingInterface";
import dayjs from "dayjs";
import DetailBookingPopup from "@/app/hotel-manager/order/components/popup/DetailBooking";
import { ApiResponse, CheckBookingResponse } from "@/utils/interface/ApiInterface";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import { Hotel } from "@/utils/interface/HotelInterface";

interface Response {
  status?: string;
  message?: string;
}

const OrderTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<BookingProps[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<number>();
  const [filters, setFilters] = useState<Filters>({});

  const router = useRouter();

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");

    if (!roleId || roleId === "R1" || roleId === "R3") {
      router.push("/not-found");
    }
  }, []);

  useEffect(() => {
    console.log(filters.isConfirmed);
  }, [filters.isConfirmed]);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const resp = await apiService.get<ApiResponse<Hotel[]>>("/hotel");
        if (resp.data.data) {
          setHotels(resp.data.data);
        } else {
          setHotels([]);
        }
      } catch (error) {}
    };
    fetchHotel();
  }, []);

  const handleOpenDetail = (id: number) => {
    setOpenDetail(true);
    setBookingId(id);
  };
  const statusOption = [
    { label: "Đã thanh toán", value: "Đã thanh toán" },
    { label: "Chưa thanh toán", value: "Chưa thanh toán" },
    { label: "Đã hết phòng", value: "Đã hết phòng" },
    { label: "Đã hủy", value: "Đã hủy" },
  ];
  const confirmOption = [
    { label: "Đã xác nhận", value: true },
    { label: "Chưa xác nhận", value: false },
  ];

  useEffect(() => {
    fetchRows();
  }, [page, rowsPerPage, filters]);

  const fetchRows = async () => {
    try {
      const input_data: Filters = {};
      // if (filters.isConfirmed === null) {
      //   input_data.isConfirmed = false;
      // }
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          input_data[key as keyof Filters] = value;
        }
      });
      const queryString = new URLSearchParams(
        Object.entries(input_data).reduce((acc, [key, value]) => {
          acc[key] = value?.toString();
          return acc;
        }, {} as Record<string, string>)
      ).toString();
      console.log(queryString);
      const response = await apiService.get<Row>(
        `/booking/by-hotel-manager?${queryString}`
      );
      const data = response.data.data;
      if (data) {
        setRows([...data].reverse());
        setTotalRows(data.length);
      } else {
        setRows([]);
        setTotalRows(0);
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
      setRows([]);
      setTotalRows(0);
    }
  };

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleCheck = async (id: number) => {
    try {
      const resp = await apiService.get<CheckBookingResponse>(
        `/booking/confirm/${id}`
      );

      if (resp.data.status === "OK") {
        await Swal.fire({
          title: "Còn đủ phòng",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      } else {
        await Swal.fire({
          title: "Đã hết phòng",
          icon: "error",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "OK",
        });
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  };

  const handleConfirm = async (id: number) => {
    const result = await confirmBooking();
    if (result.isConfirmed) {
      try {
        const resp = await apiService.put<Response>(`/booking/${id}`, {
          isConfirmed: true,
        });
        if (resp.data.status === "OK") {
          fetchRows();
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Xác nhận đơn thành công");
        } else if (resp.data.status === "ERR0") {
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Không còn phòng trống");
        } else if (resp.data.status === "ERR1") {
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Không đủ phòng");
        } else {
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Đã xảy ra lỗi");
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const handleRefuse = async (id: number) => {
    const result = await refuseBooking();
    if (result.isConfirmed) {
      try {
        const resp = await apiService.put(`/booking/${id}`, {
          isConfirmed: true,
          status: "Đã hết phòng",
        });
        if (resp && resp.status === 200) {
          fetchRows();
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Từ chối đơn thành công");
        } else {
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Đã xảy ra lỗi");
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  const handleConfirmPayment = async (id: number) => {
    const result = await confirmPaymentBooking();
    if (result.isConfirmed) {
      try {
        const resp = await apiService.put(`/booking/${id}`, {
          status: "Đã thanh toán",
        });
        if (resp && resp.status === 200) {
          fetchRows();
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Đã xác nhận thanh toán");
        } else {
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Đã xảy ra lỗi");
        }
      } catch (error: any) {
        console.log(error);
      }
    }
  };

  return (
    <div className="px-3 pb-1 pt-2 bg-white h-screen">
      <div className="px-0 py-0 shadow-gray-400 bg-white h-[80vh]">
        <TableContainer className="h-[91vh] shadow-lg rounded-lg border border-gray-300 flex flex-col bg-white">
          <div className="flex-grow">
            <Table className="w-full table-auto" aria-label="simple table">
              <TableHead className="bg-gray-100 sticky  top-0 z-10">
                <TableRow>
                  <TableCell className="text-black font-semibold w-[20%] p-3">
                    <div className="flex flex-col font-semibold w-full">
                      <span className="mb-1 text-lg text-gray-700">
                        Khách sạn
                      </span>
                      <Autocomplete
                        size="small"
                        sx={{ background: "white" }}
                        options={hotels.map((hotel) => hotel.hotelName)}
                        value={
                          hotels.find(
                            (hotel) => hotel.hotelId === filters.hotelId
                          )?.hotelName
                        }
                        onChange={(_, newValue) => {
                          const selectedHotel = hotels.find(
                            (hotel) => hotel.hotelName === newValue
                          );
                          setFilters((prevFilters) => ({
                            ...prevFilters,
                            hotelId: selectedHotel
                              ? selectedHotel.hotelId
                              : undefined,
                          }));
                        }}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" fullWidth />
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-semibold w-[15%] p-3">
                    <div className="flex flex-col font-semibold w-full">
                      <span className="mb-1 text-lg text-gray-700">
                        SĐT khách hàng
                      </span>
                      <TextField
                        size="small"
                        fullWidth
                        sx={{ background: "white", borderRadius: "5px" }}
                        name="customerPhone"
                        value={filters.customerPhone}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-black font-semibold w-[8%] p-3">
                    <div className="flex flex-col font-semibold w-full">
                      <span className="mb-1 text-lg text-gray-700">
                        Nhận phòng
                      </span>
                      <TextField
                        size="small"
                        sx={{ background: "white", borderRadius: "5px" }}
                        type="date"
                        name="dayStart"
                        value={filters.dayStart}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-semibold w-[8%] p-3">
                    <div className="flex flex-col font-semibold w-full">
                      <span className="mb-1 text-lg text-gray-700">
                        Trả phòng
                      </span>
                      <TextField
                        size="small"
                        sx={{ background: "white", borderRadius: "5px" }}
                        type="date"
                        name="dayEnd"
                        value={filters.dayEnd}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-semibold w-[13%] p-3">
                    <div className="flex flex-col font-semibold w-full">
                      <span className="mb-1 text-lg text-gray-700">
                        Trạng thái
                      </span>
                      <Autocomplete
                        size="small"
                        sx={{ background: "white", borderRadius: "5px" }}
                        options={statusOption}
                        getOptionLabel={(status) => status.label}
                        value={
                          statusOption.find(
                            (status) => status.value === filters.status
                          ) || null
                        }
                        onChange={(_, selectedOption) => {
                          handleFilterChange({
                            target: {
                              name: "status",
                              value: selectedOption ? selectedOption.value : "",
                            },
                          } as unknown as React.ChangeEvent<HTMLInputElement>);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" fullWidth />
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-semibold w-[15%] p-3">
                    <div className="flex flex-col font-semibold w-full">
                      <span className="mb-1 text-lg text-gray-700">
                        Xác nhận
                      </span>
                      <Autocomplete
                        size="small"
                        sx={{ background: "white", borderRadius: "5px" }}
                        options={confirmOption}
                        getOptionLabel={(confirm) => confirm.label}
                        value={
                          confirmOption.find(
                            (confirm) => confirm.value === filters.isConfirmed
                          ) || null
                        }
                        onChange={(_, selectedOption) => {
                          handleFilterChange({
                            target: {
                              name: "isConfirmed",
                              value: selectedOption
                                ? selectedOption.value
                                : null,
                            },
                          } as unknown as React.ChangeEvent<HTMLInputElement>);
                        }}
                        renderInput={(params) => (
                          <TextField {...params} variant="outlined" fullWidth />
                        )}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-semibold w-[15%] px-7 pt-0 pb-8">
                    <div className="font-semibold w-full pb-2">
                      <span className="block text-lg text-gray-700">
                        Action
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow className="border-0">
                    <TableCell
                      colSpan={8}
                      className="w-full text-center border-0 text-gray-600"
                    >
                      Không có dữ liệu
                    </TableCell>
                  </TableRow>
                ) : (
                  rows
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={row.bookingId}
                        className={`cursor-pointer border-b ${
                          index % 2 === 0 ? "bg-blue-50" : "bg-white"
                        } hover:bg-gray-200 transition-colors duration-200`}
                      >
                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          {hotels.find((hotel) => hotel.hotelId === row.hotelId)
                            ?.hotelName || ""}
                        </TableCell>
                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          {row.customerPhone}
                        </TableCell>
                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          {row.dayStart
                            ? dayjs(row.dayStart).format("DD/MM/YYYY")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          {row.dayEnd
                            ? dayjs(row.dayEnd).format("DD/MM/YYYY")
                            : "-"}
                        </TableCell>
                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          {row.status}
                        </TableCell>
                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          {row.isConfirmed ? "Đã xác nhận" : "Chưa xác nhận"}
                        </TableCell>
                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          <IconButton
                            onClick={() =>
                              handleOpenDetail(row.bookingId || -1)
                            }
                            className="text-gray-400 hover:text-gray-600"
                          >
                            <VisibilityIcon />
                          </IconButton>
                          {row.isConfirmed === true &&
                            row.status === "Chưa thanh toán" && (
                              <IconButton
                                onClick={() =>
                                  handleConfirmPayment(row.bookingId || -1)
                                }
                                className="text-blue-400 hover:text-blue-600"
                              >
                                <PaymentIcon />
                              </IconButton>
                            )}

                          {row.isConfirmed === false && (
                            <>
                              <IconButton
                                onClick={() => handleCheck(row.bookingId || -1)}
                                className="text-yellow-500 hover:text-yello-700"
                              >
                                <QuizIcon />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  handleConfirm(row.bookingId || -1)
                                }
                                className="text-green-500 hover:text-green-700"
                              >
                                <CheckCircleIcon />
                              </IconButton>
                              <IconButton
                                onClick={() =>
                                  handleRefuse(row.bookingId || -1)
                                }
                                className="text-red-500 hover:text-red-700"
                              >
                                <HighlightOffIcon />
                              </IconButton>
                            </>
                          )}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
          </div>
          <Grid
            container
            alignItems="center"
            justifyContent="flex-end"
            className="flex-none bg-white border-t border-gray-300 sticky bottom-0 z-10"
          >
            <TablePagination
              rowsPerPageOptions={[10, 25, 50]}
              component="div"
              count={totalRows}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </TableContainer>
        <DetailBookingPopup
          open={openDetail}
          onClose={() => setOpenDetail(false)}
          id={bookingId}
        />
        <CustomSnackbar
          open={openSnackbar}
          onClose={() => setOpenSnackbar(false)}
          severity={snackbarSeverity}
          message={snackbarMessage}
        />
      </div>
    </div>
  );
};

export default OrderTable;
