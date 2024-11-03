'use client';
import React, { useEffect, useState } from 'react';
import {Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, 
    TextField,TablePagination,Grid,Snackbar,Alert,Autocomplete,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CallToActionIcon from '@mui/icons-material/CallToAction';
import dayjs, { Dayjs } from 'dayjs'; 
import apiService from '@/services/api';

interface Row {
  id: number;
  fullname: string;
  email: string;
  phone: string;
  birthday: Dayjs;
  role: number;
}

type Filters = {
  fullname: string;
  email: string;
  phone: string;
  birthday: Dayjs | null;
  role: number | null;
};

export default function UserTable() {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Row[]>([]);
  const [totalRows, setTotalRows] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
  const [selectedRow, setSelectedRow] = useState<Row | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openEditAtId, setOpenEditAtId] = useState('');
  const [filters, setFilters] = useState<Filters>({
    fullname: '',
    email: '',
    phone: '',
    birthday: null,
    role: null,
  });

  const roleOptions = [
    { label: 'Admin', value: 1 },
    { label: 'Hotel', value: 2 },
    { label: 'User', value: 3 },
  ];

  useEffect(() => {
    fetchRows();
  }, [page, rowsPerPage, filters]);

  const fetchRows = async () => {
    try {
        const input_data: any = {
            fullname: filters.fullname,
            email: filters.email,
            phone: filters.phone,
            birthday: filters.birthday,
            role: filters.role,
        };
        const response = await apiService.post<Row[]>(`/user`, input_data);
        const data = response.data;
        setRows([]);
        setTotalRows(0);
        if (data) {
            setRows(data);
            setTotalRows(data.length);
        } else {
            setRows([]);
            setTotalRows(0);
        }
    } catch (error) {
        console.error('Error fetching data: ', error);
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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenEdit = (usernameEdit: any) => {
    setOpenEditAtId(usernameEdit);
    setOpenEdit(true);
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setSelectedRow(null);
    fetchRows();
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const handleDelete = async () => {
    
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
                          sx={{ background: 'white' }}
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
                          sx={{ background: 'white' }}
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
                          sx={{ background: 'white' }}
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
                            sx={{ background: 'white' }}
                            name="birthday"
                            type="date"
                            value={filters.birthday ? dayjs(filters.birthday).format('YYYY-MM-DD') : ''}
                            onChange={handleFilterChange}
                            />
                        </div>
                    </TableCell>

                    <TableCell  className="text-black font-bold w-[12%] px-2">
                      <div className="flex flex-col font-bold w-full">
                        <span>Role</span>
                        <Autocomplete
                            size="small"
                            sx={{ background: 'white' }}
                            options={roleOptions}
                            getOptionLabel={(option) => option.label}
                            value={roleOptions.find((option) => option.value === filters.role) || null} 
                            onChange={(_, selectedOption) => {
                            handleFilterChange({
                                target: {
                                    name: 'role',
                                    value: selectedOption ? selectedOption.value : 0,
                                },
                            } as unknown as React.ChangeEvent<HTMLInputElement>);
                        }}

                            renderInput={(params) => (
                                <TextField {...params} variant="outlined" fullWidth />
                            )}
                        />

                      </div>
                    </TableCell>
                    <TableCell  className="text-black font-bold w-[20%] px-2">
                      <div className="font-bold w-full pl-7 pt-1">
                        <span className="block">Action</span>
                        <IconButton>
                            <CallToActionIcon />
                        </IconButton>
                        </div>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.length === 0 ? (
                    <TableRow className="border-0">
                      <TableCell colSpan={8} className="w-full text-center boder-0">
                        No Data
                      </TableCell>
                    </TableRow>
                  ) : (
                    rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row) => (
                      <TableRow
                        key={row.id}
                        className="h-[45px] cursor-pointer hover:bg-gray-100 border-b border-gray-100" >
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                            {row.fullname}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                            {row.email}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                            {row.phone}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                            {dayjs(row.birthday).format('DD/MM/YYYY')}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                            {roleOptions.find((role) => role.value === row.role)?.label || ''}
                        </TableCell>
                        <TableCell className="px-2 py-1 pl-4 border-b-0">
                          <IconButton onClick={() => handleOpenEdit(row.fullname)} className="text-blue-500">
                            <EditIcon />
                            </IconButton>
                            <IconButton className="text-red-500">
                            <DeleteIcon />
                            </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
            <Grid container
                alignItems="center"
                justifyContent="flex-end"
                className="flex-none p-0 bg-white border-t border-gray-300 sticky bottom-0 z-10">
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
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <Alert
              onClose={handleCloseSnackbar}
              severity={snackbarSeverity}
              sx={{ width: '100%' }}
            >
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
    </div>
  );
}


