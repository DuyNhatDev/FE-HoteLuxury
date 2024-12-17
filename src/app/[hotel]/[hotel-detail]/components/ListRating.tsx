import { useAppContext } from "@/hooks/AppContext";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { Avatar, Button, Rating } from "@mui/material";
import React, { useEffect, useState } from "react";

interface ListRatingProps {
  hotelName?: string;
}

interface UserProps {
  userId?: number;
  fullname?: string;
  image?: string;
}

interface RatingProps {
  ratingId?: number;
  hotelId?: number;
  userId?: number;
  ratingStar?: number;
  ratingDescription?: string;
  ratingDate?: string;
  fullname?: string;
  image?: string;
}
const ListRating: React.FC<ListRatingProps> = ({ hotelName }) => {
  const [users, setUsers] = useState<UserProps[]>([]);
  const [listRating, setListRating] = useState<RatingProps[]>([]);
  const [visibleRating, setVisibleRating] = useState<RatingProps[]>([]);
  const { hotelId } = useAppContext();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const resp = await apiService.get<ApiResponse<UserProps[]>>("/user");
        setUsers(resp.data.data);
      } catch (error) {
        console.log("Error fetching orders:", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        const resp = await apiService.get<ApiResponse<RatingProps[]>>(
          `/rating/?hotelId=${hotelId}`
        );
        const rawListRating = [...resp.data.data].reverse();

        const enrichedListRating = rawListRating.map((rating) => {
          const user = users.find((user) => user.userId === rating.userId);
          return {
            ...rating,
            fullname: user?.fullname || "",
            image: user?.image || "",
          };
        });

        setListRating(enrichedListRating);
        setVisibleRating(enrichedListRating.slice(0, 5));
      } catch (error) {
        console.log("Error fetching ratings:", error);
      }
    };
    fetchRating();
  }, [users]);

  const handleShowMore = () => {
    setVisibleRating((prevVisible) => [
      ...prevVisible,
      ...listRating.slice(prevVisible.length, prevVisible.length + 5),
    ]);
  };
  const totalRatings = listRating.length;
  const averageRating =
    totalRatings > 0
      ? listRating.reduce((sum, rating) => sum + (rating.ratingStar || 0), 0) /
        totalRatings
      : 0;

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Tiêu đề */}
      <h1 className="text-2xl font-bold text-gray-800 mb-4">
        Đánh giá của khách hàng về {hotelName}
      </h1>
      <div className="flex items-center mb-6">
        {/* Điểm trung bình */}
        <Rating
          name="average-rating"
          value={averageRating / 2}
          precision={0.5}
          readOnly
          size="large"
        />
        <p className="ml-4 text-lg font-medium text-green-600 border border-green-600 px-2 py-0">
          {averageRating.toFixed(1)}/10
        </p>

        {/* Số lượt đánh giá */}
        <p className="ml-4 text-lg text-gray-500">
          ({totalRatings} lượt đánh giá)
        </p>
      </div>
      {/* Danh sách đánh giá */}
      <div className="space-y-4">
        {visibleRating.map((rating, index) => (
          <div
            key={rating.ratingId}
            className={`flex items-start bg-white m-0 ${
              index !== visibleRating.length - 1
                ? "border-b border-gray-300"
                : ""
            } py-4`}
          >
            {/* Avatar */}
            <div className="mr-4">
              <Avatar
                src={rating.image}
                alt={rating.fullname}
                className="w-10 h-10"
              />
            </div>

            {/* Nội dung đánh giá */}
            <div className="flex-1 flex items-start">
              {/* Tên và ngày đánh giá */}
              <div className="mr-4 flex-shrink-0 w-40">
                <h2 className="text-sm font-semibold text-gray-800 break-words overflow-wrap break-word">
                  {rating.fullname || "Unknown User"}
                </h2>
                <p className="text-sm text-gray-500 break-words">
                  {rating.ratingDate
                    ?.split("T")[0]
                    .split("-")
                    .reverse()
                    .join("-") || ""}
                </p>
              </div>

              {/* Phần rating và mô tả */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center">
                  <Rating
                    name={`rating-${rating.ratingId}`}
                    value={rating.ratingStar ? rating.ratingStar / 2 : 0}
                    precision={0.5}
                    size="small"
                    readOnly
                  />
                  <p className="text-sm text-gray-600 ml-2">
                    ({rating.ratingStar}/10)
                  </p>
                </div>

                {/* Nội dung mô tả */}
                <p className="text-sm text-gray-700">
                  {rating.ratingDescription}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {visibleRating.length < listRating.length && (
        <div className="text-center mt-4">
          <Button
            variant="outlined"
            sx={{
              color: "#1976d2",
              borderColor: "#1976d2",
              "&:hover": {
                backgroundColor: "rgba(25, 118, 210, 0.08)",
                borderColor: "#1976d2",
              },
            }}
            onClick={handleShowMore}
          >
            Xem thêm {Math.min(listRating.length - visibleRating.length, 5)}{" "}
            đánh giá
          </Button>
        </div>
      )}
    </div>
  );
};

export default ListRating;
