// import React, { useEffect, useState } from "react";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   TextField,
//   IconButton,
//   Box,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";
// import apiService from "@/services/api";
// import { ApiResponse } from "@/utils/interface/ApiInterface";
// import { BookingProps } from "@/utils/interface/BookingInterface";

// interface DetailBookingProps {
//   open: boolean;
//   onClose: () => void;
//   id?: number;
// }

// const DetailBookingPopup: React.FC<DetailBookingProps> = ({
//   open,
//   onClose,
//   id,
// }) => {
//   const [formData, setFormData] = useState<BookingProps>({});

//   useEffect(() => {
//     fetchData();
//   }, [open]);

//   const fetchData = async () => {
//     try {
//       const res = await apiService.get<ApiResponse<BookingProps>>(`booking/${id}`);
//       const data = res.data.data;
//       const updatedFormData = {
//         hotelName: data.hotelName || "",
//         roomTypeName: data.roomTypeName || "",
//         customerName: data.customerName || "",
//         customerPhone: data.customerPhone || "",
//         customerEmail: data.customerEmail || "",
//         dayStart: data.dayStart || "",
//         dayEnd: data.dayEnd || "",
//         paymentMethod: data.paymentMethod || "",
//         status: data.status || "",
//         isConfirmed: data.isConfirmed || false,
//         price: data.price || "",
//         roomQuantity: data.roomQuantity || "",
//         roomNumber: data.roomNumber || "",
//       };
//       setFormData((prevFormData) => ({ ...prevFormData, ...updatedFormData }));
//     } catch (error) {
//       console.log(error);
//       console.error("Error fetching data:", error);
//     }
//   };

//   return (
//     <Dialog
//       open={open}
//       onClose={onClose}
//       fullWidth
//       maxWidth="lg"
//       PaperProps={{
//         style: {
//           width: "900px",
//           position: "absolute",
//           backgroundColor: "#f9fafc",
//           borderRadius: "12px",
//           boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.1)",
//         },
//       }}
//     >
//       <DialogTitle sx={{ fontWeight: "bold", color: "#333" }}>
//         Thông tin Đơn đặt phòng
//         <IconButton
//           aria-label="close"
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             right: 8,
//             top: 8,
//             color: "#727272",
//           }}
//         >
//           <CloseIcon />
//         </IconButton>
//       </DialogTitle>
//       <DialogContent>
//         <Box display="flex" flexDirection="column" gap="20px">
//           <Box
//             display="flex"
//             flexDirection="column"
//             width="100%"
//             border="1px solid #e0e0e0"
//             borderRadius="10px"
//             boxShadow="0px 2px 8px rgba(0, 0, 0, 0.05)"
//             padding="16px"
//           >
//             {/* Form Fields */}
//             <Box
//               display="flex"
//               flexDirection="row"
//               justifyContent="space-between"
//               gap="50px"
//               marginBottom="5px"
//             >
//               <TextField
//                 margin="dense"
//                 label="Tên khách sạn"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.hotelName}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 margin="dense"
//                 label="Loại phòng"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.roomTypeName}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Box>

//             <Box
//               display="flex"
//               flexDirection="row"
//               justifyContent="space-between"
//               gap="50px"
//               marginBottom="5px"
//             >
//               <TextField
//                 margin="dense"
//                 label="Tên khách hàng"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.customerName}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 margin="dense"
//                 label="Số điện thoại"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.customerPhone}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Box>

//             {/* Other Form Fields */}
//             <Box
//               display="flex"
//               flexDirection="row"
//               justifyContent="space-between"
//               gap="50px"
//               marginBottom="5px"
//             >
//               <TextField
//                 margin="dense"
//                 label="Email"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.customerEmail}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 margin="dense"
//                 label="Phương thức thanh toán"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.paymentMethod}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Box>

//             <Box
//               display="flex"
//               justifyContent="space-between"
//               gap="50px"
//               marginBottom="5px"
//             >
//               <TextField
//                 margin="dense"
//                 label="Email"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.dayStart}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 margin="dense"
//                 label="Phương thức thanh toán"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.dayEnd}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Box>

//             <Box
//               display="flex"
//               justifyContent="space-between"
//               gap="50px"
//               marginBottom="5px"
//             >
//               <TextField
//                 margin="dense"
//                 label="Trạng thái"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.status}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 margin="dense"
//                 label="Xác nhận"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.isConfirmed}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Box>

//             <Box
//               display="flex"
//               justifyContent="space-between"
//               gap="50px"
//               marginBottom="5px"
//             >
//               <TextField
//                 margin="dense"
//                 label="Số lượng"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.roomQuantity}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 margin="dense"
//                 label="Phòng"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.roomNumber}
//                 InputLabelProps={{ shrink: true }}
//               />
//               <TextField
//                 margin="dense"
//                 label="Tổng giá"
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 required
//                 value={formData.price}
//                 InputLabelProps={{ shrink: true }}
//               />
//             </Box>
//           </Box>
//         </Box>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default DetailBookingPopup;
