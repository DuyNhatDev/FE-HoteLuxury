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
  Button,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import apiService from "@/services/api";
import { Add } from "@mui/icons-material";
import { confirmDeleteDialog } from "@/utils/notification/confirm-dialog";
import CustomSnackbar from "@/app/components/CustomSnackbar";
import {
  Destination,
  DestinationFilter,
  Row,
} from "@/utils/interface/DestinationInterface";
import Image from "next/image";
import CreateEditPopup from "@/app/admin/destination/components/popup/Create-EditDestination";
import { useRouter } from "next/navigation";

const DestinationTable = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Destination[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [type, setType] = useState<string>("add");
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<"success" | "error">(
    "success"
  );
  const [openPopup, setOpenPopup] = useState<boolean>(false);
  const [idEdit, setIdEdit] = useState<number>(-1);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [filters, setFilters] = useState<DestinationFilter>({
    locationName: "",
  });

  const router = useRouter();

  useEffect(() => {
    const roleId = localStorage.getItem("roleId");

    if (!roleId || roleId === "R2" || roleId === "R3") {
      router.push("/not-found");
    }
  }, []);

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
      if (filters.locationName) {
        input_data.locationName = filters.locationName;
      }
      const queryString = new URLSearchParams(input_data).toString();
      const response = await apiService.get<Row>(
        `/location/filter?${queryString}`
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

  const handleDelete = async (id: number) => {
    const result = await confirmDeleteDialog();
    if (result.isConfirmed) {
      try {
        const response = await apiService.delete(`/location/${id}`);
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
        <TableContainer className="h-[91vh] shadow-lg rounded-lg border border-gray-300 flex flex-col bg-white">
          <div className="flex-grow">
            <Table className="w-full table-auto" aria-label="simple table">
              <TableHead className="bg-gray-100 sticky  top-0 z-10">
                <TableRow>
                  <TableCell className="text-black font-semibold w-[30%] p-3">
                    <div className="flex flex-col font-semibold w-full">
                      <span className="mb-1 text-lg text-gray-700">
                        Hình ảnh
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-black font-semibold w-[40%] p-3">
                    <div className="flex flex-col font-semibold w-64">
                      <span className="mb-1 text-lg text-gray-700">
                        Tên địa điểm
                      </span>
                      <TextField
                        size="small"
                        sx={{ background: "white", borderRadius: "5px" }}
                        name="locationName"
                        value={filters.locationName}
                        onChange={handleFilterChange}
                      />
                    </div>
                  </TableCell>

                  <TableCell className="text-black font-semibold w-[10%] p-3">
                    <div className="font-semibold w-full pl-5 pb-2">
                      <span className="block text-lg text-gray-700">
                        Action
                      </span>
                      <Button
                        className="bg-green-500 text-white hover:bg-green-600 mt-1 py-2 text-xs"
                        variant="contained"
                        size="small"
                        color="primary"
                        startIcon={<Add />}
                        onClick={handleOpenAdd}
                      >
                        Thêm
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
                      className="w-full text-center border-0 text-gray-600"
                    >
                      No Data Available
                    </TableCell>
                  </TableRow>
                ) : (
                  rows
                    .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
                    .map((row, index) => (
                      <TableRow
                        key={row.locationId}
                        className={`cursor-pointer border-b ${
                          index % 2 === 0 ? "bg-blue-50" : "bg-white"
                        } hover:bg-gray-200 transition-colors duration-200`}
                      >
                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          <div
                            style={{
                              width: "50px",
                              height: "40px",
                              overflow: "hidden",
                              borderRadius: "4px",
                            }}
                          >
                            <Image
                              src={`http://localhost:9000/uploads/${row.locationImage}`}
                              alt="Image"
                              width={50}
                              height={40}
                              style={{
                                objectFit: "cover",
                                width: "100%",
                                height: "100%",
                              }}
                            />
                          </div>
                        </TableCell>

                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          {row.locationName}
                        </TableCell>

                        <TableCell className="text-lg p-2 pl-4 border-b-0">
                          <IconButton
                            onClick={() => handleOpenEdit(row.locationId)}
                            className="text-blue-500 hover:text-blue-700"
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => handleDelete(row.locationId)}
                            className="text-red-500 hover:text-red-700"
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
        <CreateEditPopup
          open={openPopup}
          onClose={handleClosePopup}
          id={idEdit}
          type={type}
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

export default DestinationTable;
