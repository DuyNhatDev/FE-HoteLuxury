// 'use client';
// import React, { useEffect, useState } from 'react';
// import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton, 
//     TextField, TablePagination, Grid, Snackbar, Alert, Autocomplete,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import DeleteIcon from '@mui/icons-material/Delete';
// import CallToActionIcon from '@mui/icons-material/CallToAction';
// import dayjs, { Dayjs } from 'dayjs';

// interface Row {
//   id: number;
//   fullname: string;
//   email: string;
//   phone: string;
//   gender: string;
//   birthday: Dayjs;
//   role: number;
// }

// type Filters = {
//   fullname: string;
//   email: string;
//   phone: string;
//   gender: string;
//   birthday: Dayjs | null;
//   role: number | null;
// };

// export default function UserTable() {
//   const [page, setPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [rows, setRows] = useState<Row[]>([]);
//   const [totalRows, setTotalRows] = useState(0);
//   const [openSnackbar, setOpenSnackbar] = useState(false);
//   const [snackbarMessage, setSnackbarMessage] = useState('');
//   const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');
//   const [selectedRow, setSelectedRow] = useState<Row | null>(null);
//   const [openEdit, setOpenEdit] = useState(false);
//   const [openEditAtId, setOpenEditAtId] = useState('');
//   const [filters, setFilters] = useState<Filters>({
//     fullname: '',
//     email: '',
//     phone: '',
//     gender: '',
//     birthday: null,
//     role: null,
//   });

//   const roleOptions = [
//     { label: 'Admin', value: 1 },
//     { label: 'Hotel', value: 2 },
//     { label: 'User', value: 3 },
//   ];

//   const genderOptions = [
//     { label: 'Nam', value: 'Nam' },
//     { label: 'Nữ', value: 'Nữ' },
//   ];

//   useEffect(() => {
//     fetchRows();
//   }, [page, rowsPerPage, filters]);

//   const fetchRows = () => {
//     const data: Row[] = [
//   {
//     id: 1,
//     fullname: 'Nguyễn Văn A',
//     email: 'nguyenvana@example.com',
//     phone: '0912345678',
//     gender: 'Nam',
//     birthday: dayjs('1990-01-01'),
//     role: 1,
//   },
//   {
//     id: 2,
//     fullname: 'Trần Thị B',
//     email: 'tranthib@example.com',
//     phone: '0918765432',
//     gender: 'Nữ',
//     birthday: dayjs('1992-02-02'),
//     role: 2,
//   },
//   {
//     id: 3,
//     fullname: 'Lê Văn C',
//     email: 'levanc@example.com',
//     phone: '0934567890',
//     gender: 'Nam',
//     birthday: dayjs('1988-03-03'),
//     role: 3,
//   },
//   {
//     id: 4,
//     fullname: 'Phạm Thị D',
//     email: 'phamthid@example.com',
//     phone: '0912456789',
//     gender: 'Nữ',
//     birthday: dayjs('1993-04-04'),
//     role: 4,
//   },
//   {
//     id: 5,
//     fullname: 'Hoàng Văn E',
//     email: 'hoangvane@example.com',
//     phone: '0915678901',
//     gender: 'Nam',
//     birthday: dayjs('1995-05-05'),
//     role: 5,
//   },
//   {
//     id: 6,
//     fullname: 'Đỗ Thị F',
//     email: 'dothif@example.com',
//     phone: '0923456781',
//     gender: 'Nữ',
//     birthday: dayjs('1994-06-06'),
//     role: 6,
//   },
//   {
//     id: 7,
//     fullname: 'Bùi Văn G',
//     email: 'buivang@example.com',
//     phone: '0912345890',
//     gender: 'Nam',
//     birthday: dayjs('1987-07-07'),
//     role: 7,
//   },
//   {
//     id: 8,
//     fullname: 'Trịnh Thị H',
//     email: 'trinhthih@example.com',
//     phone: '0932456789',
//     gender: 'Nữ',
//     birthday: dayjs('1991-08-08'),
//     role: 8,
//   },
//   {
//     id: 9,
//     fullname: 'Ngô Văn I',
//     email: 'ngovanyi@example.com',
//     phone: '0913456789',
//     gender: 'Nam',
//     birthday: dayjs('1986-09-09'),
//     role: 9,
//   },
//   {
//     id: 10,
//     fullname: 'Đặng Thị J',
//     email: 'dangthij@example.com',
//     phone: '0923567890',
//     gender: 'Nữ',
//     birthday: dayjs('1993-10-10'),
//     role: 10,
//   },
//   {
//     id: 11,
//     fullname: 'Vũ Văn K',
//     email: 'vuvank@example.com',
//     phone: '0915678902',
//     gender: 'Nam',
//     birthday: dayjs('1990-11-11'),
//     role: 1,
//   },
//   {
//     id: 12,
//     fullname: 'Phạm Thị L',
//     email: 'phamthil@example.com',
//     phone: '0912346790',
//     gender: 'Nữ',
//     birthday: dayjs('1992-12-12'),
//     role: 2,
//   },
//   {
//     id: 13,
//     fullname: 'Lý Văn M',
//     email: 'lyvanm@example.com',
//     phone: '0923456783',
//     gender: 'Nam',
//     birthday: dayjs('1985-01-13'),
//     role: 3,
//   },
//   {
//     id: 14,
//     fullname: 'Trương Thị N',
//     email: 'truongthin@example.com',
//     phone: '0912456781',
//     gender: 'Nữ',
//     birthday: dayjs('1993-02-14'),
//     role: 4,
//   },
//   {
//     id: 15,
//     fullname: 'Nguyễn Văn O',
//     email: 'nguyenvano@example.com',
//     phone: '0914567891',
//     gender: 'Nam',
//     birthday: dayjs('1991-03-15'),
//     role: 5,
//   },
//   {
//     id: 16,
//     fullname: 'Lê Thị P',
//     email: 'lethip@example.com',
//     phone: '0915678920',
//     gender: 'Nữ',
//     birthday: dayjs('1995-04-16'),
//     role: 6,
//   },
//   {
//     id: 17,
//     fullname: 'Hoàng Văn Q',
//     email: 'hoangvanq@example.com',
//     phone: '0923456791',
//     gender: 'Nam',
//     birthday: dayjs('1989-05-17'),
//     role: 7,
//   },
//   {
//     id: 18,
//     fullname: 'Phạm Thị R',
//     email: 'phamthir@example.com',
//     phone: '0914567892',
//     gender: 'Nữ',
//     birthday: dayjs('1994-06-18'),
//     role: 8,
//   },
//   {
//     id: 19,
//     fullname: 'Vũ Văn S',
//     email: 'vuvans@example.com',
//     phone: '0934567891',
//     gender: 'Nam',
//     birthday: dayjs('1990-07-19'),
//     role: 9,
//   },
//   {
//     id: 20,
//     fullname: 'Đỗ Thị T',
//     email: 'dothit@example.com',
//     phone: '0923456784',
//     gender: 'Nữ',
//     birthday: dayjs('1992-08-20'),
//     role: 10,
//   },
//   {
//     id: 21,
//     fullname: 'Nguyễn Văn U',
//     email: 'nguyenvanu@example.com',
//     phone: '0912346791',
//     gender: 'Nam',
//     birthday: dayjs('1991-09-21'),
//     role: 1,
//   },
//   {
//     id: 22,
//     fullname: 'Lê Thị V',
//     email: 'lethiv@example.com',
//     phone: '0913456781',
//     gender: 'Nữ',
//     birthday: dayjs('1990-10-22'),
//     role: 2,
//   },
//   {
//     id: 23,
//     fullname: 'Hoàng Văn X',
//     email: 'hoangvanx@example.com',
//     phone: '0923456785',
//     gender: 'Nam',
//     birthday: dayjs('1993-11-23'),
//     role: 3,
//   },
//   {
//     id: 24,
//     fullname: 'Trần Thị Y',
//     email: 'tranthiy@example.com',
//     phone: '0914567893',
//     gender: 'Nữ',
//     birthday: dayjs('1994-12-24'),
//     role: 4,
//   },
//   {
//     id: 25,
//     fullname: 'Ngô Văn Z',
//     email: 'ngovanz@example.com',
//     phone: '0915678903',
//     gender: 'Nam',
//     birthday: dayjs('1987-01-25'),
//     role: 5,
//   },
//   {
//     id: 26,
//     fullname: 'Đặng Thị AA',
//     email: 'dangthiaa@example.com',
//     phone: '0923456786',
//     gender: 'Nữ',
//     birthday: dayjs('1991-02-26'),
//     role: 6,
//   },
//   {
//     id: 27,
//     fullname: 'Lê Văn BB',
//     email: 'levanbb@example.com',
//     phone: '0934567892',
//     gender: 'Nam',
//     birthday: dayjs('1992-03-27'),
//     role: 7,
//   },
//   {
//     id: 28,
//     fullname: 'Phạm Thị CC',
//     email: 'phamthicc@example.com',
//     phone: '0912346792',
//     gender: 'Nữ',
//     birthday: dayjs('1993-04-28'),
//     role: 8,
//   },
//   {
//     id: 29,
//     fullname: 'Nguyễn Văn DD',
//     email: 'nguyenvandd@example.com',
//     phone: '0915678923',
//     gender: 'Nam',
//     birthday: dayjs('1994-05-29'),
//     role: 9,
//   },
//   {
//     id: 30,
//     fullname: 'Trần Thị EE',
//     email: 'tranthiee@example.com',
//     phone: '0923456787',
//     gender: 'Nữ',
//     birthday: dayjs('1995-06-30'),
//     role: 10,
//   },
// ];


//     setRows(data);
//     setTotalRows(data.length);
//   };

//   const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const { name, value } = event.target;
//     setFilters((prevFilters) => ({
//       ...prevFilters,
//       [name]: value,
//     }));
//   };

//   const handleChangePage = (event: unknown, newPage: number) => {
//     setPage(newPage);
//   };

//   const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setRowsPerPage(parseInt(event.target.value, 10));
//     setPage(0);
//   };

//   const handleOpenEdit = (usernameEdit: any) => {
//     setOpenEditAtId(usernameEdit);
//     setOpenEdit(true);
//   };

//   const handleCloseEdit = () => {
//     setOpenEdit(false);
//     setSelectedRow(null);
//     fetchRows();
//   };

//   const handleCloseSnackbar = () => {
//     setOpenSnackbar(false);
//   };

//   return (
//     <div className="px-3 pb-1 pt-2 bg-white h-screen">
//         <div className="px-0 py-0 shadow-gray-400 bg-white h-[80vh]">
//           <TableContainer className="h-[91vh] shadow-lg rounded-lg border border-gray-300 flex flex-col">
//             <div className="flex-grow">
//               <Table className="w-full table-auto" aria-label="simple table">
//                 <TableHead className="bg-gray-100 sticky top-0 z-10">
//                   <TableRow>
//                     <TableCell className="text-black font-bold w-[25%] px-2">
//                       <div className="flex flex-col font-bold w-full">
//                         <span>Full name</span>
//                         <TextField
//                           size="small"
//                           fullWidth
//                           sx={{ background: 'white' }}
//                           name="fullname"
//                           value={filters.fullname}
//                           onChange={handleFilterChange}
//                         />
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-black font-bold w-[25%] px-2">
//                       <div className="flex flex-col font-bold w-full">
//                         <span>Email</span>
//                         <TextField
//                           size="small"
//                           sx={{ background: 'white' }}
//                           name="email"
//                           value={filters.email}
//                           onChange={handleFilterChange}
//                         />
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-black font-bold w-[15%] px-2">
//                       <div className="flex flex-col font-bold w-full">
//                         <span>Phone Number</span>
//                         <TextField
//                           size="small"
//                           sx={{ background: 'white' }}
//                           name="phone"
//                           value={filters.phone}
//                           onChange={handleFilterChange}
//                         />
//                       </div>
//                     </TableCell>
//                     <TableCell className="text-black font-bold w-[10%] px-2">
//                         <div className="flex flex-col font-bold w-full">
//                             <span>Birthday</span>
//                             <TextField
//                             size="small"
//                             sx={{ background: 'white' }}
//                             name="birthday"
//                             type="date"
//                             value={filters.birthday ? dayjs(filters.birthday).format('YYYY-MM-DD') : ''}
//                             onChange={handleFilterChange}
//                             />
//                         </div>
//                     </TableCell>
//                     <TableCell  className="text-black font-bold w-[12%] px-2">
//                       <div className="flex flex-col font-bold w-full">
//                         <span>Role</span>
//                         <Autocomplete
//                             size="small"
//                             sx={{ background: 'white' }}
//                             options={roleOptions}
//                             getOptionLabel={(option) => option.label}
//                             value={roleOptions.find((option) => option.value === filters.role) || null} 
//                             onChange={(_, selectedOption) => {
//                             handleFilterChange({
//                                 target: {
//                                     name: 'role',
//                                     value: selectedOption ? selectedOption.value : 0,
//                                 },
//                             } as unknown as React.ChangeEvent<HTMLInputElement>);
//                         }}

//                             renderInput={(params) => (
//                                 <TextField {...params} variant="outlined" fullWidth />
//                             )}
//                         />
//                       </div>
//                     </TableCell>
//                     <TableCell  className="text-black font-bold w-[20%] px-2">
//                       <div className="font-bold w-full pl-7 pt-1">
//                         <span className="block">Action</span>
//                         <IconButton>
//                             <CallToActionIcon />
//                         </IconButton>
//                         </div>
//                     </TableCell>
//                   </TableRow>
//                 </TableHead>
//                 <TableBody>
//                   {rows.length === 0 ? (
//                     <TableRow>
//                       <TableCell colSpan={8} className="w-full text-center border-0">
//                         No Data
//                       </TableCell>
//                     </TableRow>
//                   ) : (
//                     rows.slice(page * rowsPerPage, (page + 1) * rowsPerPage).map((row) => (
//                       <TableRow
//                         key={row.id}
//                         className="h-[45px] cursor-pointer hover:bg-gray-100 border-b border-gray-100" >
//                         <TableCell className="px-2 py-1 pl-4 border-b-0">
//                             {row.fullname}
//                         </TableCell>
//                         <TableCell className="px-2 py-1 pl-4 border-b-0">
//                             {row.email}
//                         </TableCell>
//                         <TableCell className="px-2 py-1 pl-4 border-b-0">
//                             {row.phone}
//                         </TableCell>
//                         <TableCell className="px-2 py-1 pl-4 border-b-0">
//                             {dayjs(row.birthday).format('DD/MM/YYYY')}
//                         </TableCell>
//                         <TableCell className="px-2 py-1 pl-4 border-b-0">
//                             {roleOptions.find((role) => role.value === row.role)?.label || ''}
//                         </TableCell>
//                         <TableCell className="px-2 py-1 pl-4 border-b-0">
//                           <IconButton onClick={() => handleOpenEdit(row.fullname)} className="text-blue-500">
//                             <EditIcon />
//                             </IconButton>
//                             <IconButton className="text-red-500">
//                             <DeleteIcon />
//                             </IconButton>
//                         </TableCell>
//                       </TableRow>
//                     ))
//                   )}
//                 </TableBody>
//               </Table>
//             </div>
//             <Grid
//     container
//     alignItems="center"
//     justifyContent="flex-end"
//     className="flex-none p-0 bg-white border-t border-gray-300 sticky bottom-0 z-10"
//   >
//     <Grid item>
//         <TablePagination
//           rowsPerPageOptions={[10, 25, 50]}
//           component="div"
//           count={totalRows}
//           rowsPerPage={rowsPerPage}
//           page={page}
//           onPageChange={handleChangePage}
//           onRowsPerPageChange={handleChangeRowsPerPage}
//         />
//     </Grid>
//   </Grid>
//           </TableContainer>
//         </div>
      
//     </div>
//   );
// }
