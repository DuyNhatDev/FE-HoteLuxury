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
  Snackbar,
  Alert,
  Autocomplete,
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import dayjs, { Dayjs } from "dayjs";
import apiService from "@/services/api";
import { Add } from "@mui/icons-material";
import CreateEditPopup from "@/app/admin/user/components/popup/Create-EditUser";
import Swal from "sweetalert2";

interface Row {
  status: string;
  message: string;
  data: Data[];
}

interface Data {
  fullname: string;
  email: string;
  phoneNumber: string;
  birthDate: Dayjs;
  roleId: string;
  image: string;
  userId: number
}

type Filters = {
  fullname: string;
  email: string;
  phone: string;
  birthDate: Dayjs | null;
  roleId: string | null;
};

export default function UserTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [type, setType] = useState<string>("add");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>(-1);
  const [filters, setFilters] = useState<Filters>({
    fullname: "",
    email: "",
    phone: "",
    birthDate: null,
    roleId: null,
  });

  const roleOptions = [
    { label: "Admin", value: "R1" },
    { label: "Hotel", value: "R2" },
    { label: "User", value: "R3" },
  ];

  useEffect(() => {
    fetchRows();
  }, [page, rowsPerPage, filters]);

  const handleOpenAdd = () => {
    setType("add");
    setOpenPopup(true);
  };

  const handleOpenEdit = (id: number) => {
    setIdEdit(id);
    setType("edit");
    setOpenPopup(true);
  };

  const handleClosePopup = () => {
    setType("edit");
    setOpenPopup(false);
    fetchRows();
  };

  const fetchRows = async () => {
    try {
      const input_data: any = {};

      if (filters.fullname) {
        input_data.fullname = filters.fullname;
      }
      if (filters.email) {
        input_data.email = filters.email;
      }
      if (filters.phone) {
        input_data.phone = filters.phone;
      }
      if (filters.birthDate) {
        input_data.birthDate = filters.birthDate;
      }
      if (filters.roleId) {
        input_data.roleId = filters.roleId;
      }
      const queryString = new URLSearchParams(input_data).toString();
      const response = await apiService.get<Row[]>(`/user/filter?${queryString}`);
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

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDelete = async (id: number) => {
    const result = await Swal.fire({
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa",
      cancelButtonText: "Hủy",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await apiService.delete(`/user/${id}`);
        if (response && response.status === 200) {
          fetchRows();
          setOpenSnackbar(true);
          setSnackbarSeverity("success");
          setSnackbarMessage("Xóa thành công");
        } else {
          setOpenSnackbar(true);
          setSnackbarSeverity("error");
          setSnackbarMessage("Đã xảy ra lỗi");
        }
      } catch (error: any) {
        setOpenSnackbar(true);
        setSnackbarSeverity("error");
        setSnackbarMessage("Đã xảy ra lỗi khi xóa");
      }
    }
  };

  return (
    <div className="px-3 pb-1 pt-2 bg-white h-screen">
      <div className="px-0 py-0 shadow-gray-400 bg-white h-[80vh]">
        <TableContainer className="h-[91vh] shadow-lg rounded-lg border border-gray-300 flex flex-col">
          <div className="flex-grow">
            <Table className="w-full table-auto" aria-label="simple table">
              <TableHead className="bg-gray-100 sticky top-0 z-10">
                <TableRow>
                  <TableCell className="text-black font-bold w-[25%] px-2">
                    <div className="flex flex-col font-bold w-full">
                      <span>Full name</span>
                      <TextField
                        size="small"
                        fullWidth
                        sx={{ background: "white" }}
                        name="fullname"
                        value={filters.fullname}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-bold w-[25%] px-2">
                    <div className="flex flex-col font-bold w-full">
                      <span>Email</span>
                      <TextField
                        size="small"
                        sx={{ background: "white" }}
                        name="email"
                        value={filters.email}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-bold w-[15%] px-2">
                    <div className="flex flex-col font-bold w-full">
                      <span>Phone Number</span>
                      <TextField
                        size="small"
                        sx={{ background: "white" }}
                        name="phone"
                        value={filters.phone}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-bold w-[10%] px-2">
                    <div className="flex flex-col font-bold w-full">
                      <span>Birthday</span>
                      <TextField
                        size="small"
                        sx={{ background: "white" }}
                        name="birthDate"
                        type="date"
                        value={filters.birthDate}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-black font-bold w-[12%] px-2">
                    <div className="flex flex-col font-bold w-full">
                      <span>Role</span>
                      <Autocomplete
                        size="small"
                        sx={{ background: "white" }}
                        options={roleOptions}
                        getOptionLabel={(option) => option.label}
                        value={
                          roleOptions.find(
                            (option) => option.value === filters.roleId
                          ) || null
                        }
                        onChange={(_, selectedOption) => {
                          handleFilterChange({
                            target: {
                              name: "roleId",
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
                  <TableCell className="text-black font-bold w-[20%] px-2">
                    <div className="font-bold w-full pl-7 pt-1">
                      <span className="block">Action</span>
                      <Button
                        variant="contained"
                        size="small"
                        color="primary"
                        className="mr-3 px-2 py-2 text-xs" //
                        startIcon={<Add />}
                        onClick={handleOpenAdd}
                      >
                        Create
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.length === 0 ? (
                  <TableRow className="border-0">
                    <TableCell
                      colSpan={8}
                      className="w-full text-center boder-0"
                    >
                      No Data
                    </TableCell>
                  </TableRow>
                ) : (
                  rows
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                    .map((row) => (
                      <TableRow
                        key={row.userId}
                        className="h-[45px] cursor-pointer hover:bg-gray-100 border-b border-gray-100"
                      >
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                          {row.fullname}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                          {row.email}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                          {row.phoneNumber}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                          {dayjs(row.birthDate).format("DD/MM/YYYY")}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                          {roleOptions.find((role) => role.value === row.roleId)
                            ?.label || ""}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                          <IconButton
                            onClick={() => handleOpenEdit(row.userId)}
                            className="text-blue-500"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(row.userId)}
                            className="text-red-500"
                          >
                            <DeleteIcon />
                          </IconButton>
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
            className="flex-none p-0 bg-white border-t border-gray-300 sticky bottom-0 z-10"
          >
            <Grid item>
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
          </Grid>
        </TableContainer>
        <CreateEditPopup
          open={openPopup}
          onClose={handleClosePopup}
          id={idEdit}
          type={type}
        />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            onClose={handleCloseSnackbar}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
}
