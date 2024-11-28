import Swal from "sweetalert2";

export const confirmDeleteDialog = async () => {
  return await Swal.fire({
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
};
export const confirmBookingDialog = async () => {
  return await Swal.fire({
    title: "Xác nhận đặt phòng?",
    text: "Hành động này không thể hoàn tác!",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Đồng ý",
    cancelButtonText: "Hủy",
    reverseButtons: true,
  });
};
