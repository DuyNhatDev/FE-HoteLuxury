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
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import apiService from "@/services/api";
import {
  confirmBooking,
  confirmDeleteDialog,
  refuseBooking,
} from "@/utils/notification/confirm-dialog";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import { BookingProps, Filters, Row } from "@/utils/interface/BookingInterface";
import dayjs from "dayjs";
import DetailBookingPopup from "@/app/hotel-management/order/components/popup/DetailBooking";
import {
  ApiResponse,
  CheckBookingResponse,
} from "@/utils/interface/ApiInterface";
import Swal from "sweetalert2";

const OrderTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<BookingProps[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openDetail, setOpenDetail] = useState<boolean>(false);
  const [bookingId, setBookingId] = useState<number>();
  const [filters, setFilters] = useState<Filters>({});

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

      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          input_data[key as keyof Filters] = value;
        }
      });
      const queryString = new URLSearchParams(
        input_data as Record<string, string>
      ).toString();
      const response = await apiService.get<Row>(`/booking?${queryString}`);
      const data = response.data.data;
      if (data) {
        setRows(data);
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
        const resp = await apiService.put(`/booking/${id}`, {
          isConfirmed: true,
        });
        if (resp && resp.status === 200) {
          fetchRows();
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Xác nhận đơn thành công");
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
          setSnackbarMessage("Từ chối thành công");
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
                        Tên khách hàng
                      </span>
                      <TextField
                        size="small"
                        fullWidth
                        sx={{ background: "white", borderRadius: "5px" }}
                        name="customerName"
                        value={filters.customerName}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-semibold w-[10%] p-3">
                    <div className="flex flex-col font-semibold w-full">
                      <span className="mb-1 text-lg text-gray-700">
                        Số điện thoại
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

                  <TableCell className="text-black font-semibold w-[10%] p-3">
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
                  <TableCell className="text-black font-semibold w-[10%] p-3">
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
                  <TableCell className="text-black font-semibold w-[15%] p-3">
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
                          {row.customerName}
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
                          {row.isConfirmed === false && (
                            <>
                              <IconButton
                                onClick={() => handleCheck(row.bookingId || -1)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <EditIcon />
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
