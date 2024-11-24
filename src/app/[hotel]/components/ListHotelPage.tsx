"use client";
import { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Rating,
  FormControlLabel,
  Checkbox,
  TextField,
  Button,
} from "@mui/material";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { HotelFilter, HotelProps } from "@/utils/interface/HotelInterface";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const ListHotelPage = () => {
  const [hotels, setHotels] = useState<HotelProps[]>([]);
  const [visibleHotels, setVisibleHotels] = useState<HotelProps[]>([]);
  const [formData, setFormData] = useState<HotelFilter>({
    hotelName: "",
    hotelStar: [],
    hotelType: [],
  });

  const handleFilterChange = (key: keyof HotelFilter, value: any) => {
    setFormData((prev) => {
      if (key === "hotelStar") {
        const stars = prev.hotelStar || [];
        return {
          ...prev,
          hotelStar: stars.includes(value)
            ? stars.filter((star) => star !== value)
            : [...stars, value],
        };
      }
      if (key === "hotelType") {
        const types = prev.hotelType || [];
        return {
          ...prev,
          hotelType: types.includes(value)
            ? types.filter((type) => type !== value)
            : [...types, value],
        };
      }
      return {
        ...prev,
        [key]: value,
      };
    });
  };

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const locationId = sessionStorage.getItem("locationId");
        const params = new URLSearchParams();
        if (locationId) params.append("locationId", locationId);
        if (formData.hotelName) params.append("hotelName", formData.hotelName);
        if (formData.hotelStar?.length) {
          formData.hotelStar.forEach((star) =>
            params.append("hotelStar", String(star))
          );
        }
        if (formData.hotelType?.length) {
          formData.hotelType.forEach((type) =>
            params.append("hotelType", type)
          );
        }

        const resp = await apiService.get<ApiResponse<HotelProps[]>>(
          `/hotel/filter?${params.toString()}`
        );
        const fetchedHotels = resp.data.data || [];
        setHotels(fetchedHotels);
        setVisibleHotels(fetchedHotels.slice(0, 5)); // Hiển thị tối đa
        //setVisibleHotels(fetchedHotels.slice(0, 10)); // Hiển thị tối đa
      } catch (error) {
        console.error("Error fetching hotels:", error);
      }
    };

    fetchHotels();
  }, [formData]);

  const handleShowMore = () => {
    setVisibleHotels((prevVisible) => [
      ...prevVisible,
      ...hotels.slice(prevVisible.length, prevVisible.length + 5),
      //...hotels.slice(prevVisible.length, prevVisible.length + 10),
    ]);
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">Danh sách khách sạn</h1>
        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className="w-1/4 bg-white p-4 rounded-lg shadow">
            <div className="mb-4">
              <TextField
                label="Nhập tên khách sạn"
                variant="outlined"
                fullWidth
                size="small"
                placeholder="Nhập tên khách sạn"
                value={formData.hotelName}
                onChange={(e) =>
                  handleFilterChange("hotelName", e.target.value)
                }
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Hạng sao</h3>
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-1 mb-0">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={formData.hotelStar?.includes(star) || false}
                        onChange={() => handleFilterChange("hotelStar", star)}
                      />
                    }
                    label={
                      <div className="flex items-center gap-1">
                        {Array(star)
                          .fill("")
                          .map((_, index) => (
                            <span
                              key={index}
                              className="text-yellow-500 text-lg"
                            >
                              ★
                            </span>
                          ))}
                      </div>
                    }
                  />
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 my-4"></div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Loại</h3>
              {[
                "Khách sạn",
                "Khu nghỉ dưỡng",
                "Biệt thự",
                "Căn hộ",
                "Nhà nghỉ",
              ].map((type) => (
                <div key={type} className="flex items-center gap-1 mb-0">
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        checked={formData.hotelType?.includes(type) || false}
                        onChange={() => handleFilterChange("hotelType", type)}
                      />
                    }
                    label={type}
                    className="text-sm"
                  />
                </div>
              ))}
            </div>
          </aside>

          {/* Hotel List */}
          <div className="w-3/4">
            {hotels.length === 0 ? (
              <p className="text-lg text-center text-gray-600 px-4 py-2">
                Không tìm thấy khách sạn phù hợp.
              </p>
            ) : (
              <>
                <List>
                  {visibleHotels.map((hotel) => (
                    <ListItem
                      key={hotel.hotelId}
                      className="bg-white mb-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                      sx={{
                        height: "250px",
                        width: "800px",
                        alignItems: "center",
                        transition: "box-shadow 0.3s ease, border 0.3s ease",
                        border: "1px solid #e0e0e0",
                        ":hover": {
                          border: "1px solid #007BFF",
                        },
                        borderRadius: "8px",
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar
                          variant="square"
                          src={`http://localhost:9000/uploads/${hotel.hotelImage}`}
                          alt={hotel.hotelName}
                          sx={{
                            width: 300,
                            height: 220,
                            borderRadius: "8px",
                            objectFit: "cover",
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-1">
                              {hotel.hotelName}
                            </h3>
                            <Rating
                              name="read-only"
                              value={hotel.hotelStar || 0}
                              readOnly
                              size="small"
                            />
                          </div>
                        }
                        secondary={
                          <div>
                            <div className="flex items-center text-sm text-gray-500 mb-2">
                              <LocationOnIcon
                                fontSize="small"
                                className="mr-2 text-red-500"
                              />
                              <span className="font-medium">
                                {hotel.hotelAddress}
                              </span>
                            </div>
                            <div className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-700 inline-block">
                              {hotel.hotelType}
                            </div>
                          </div>
                        }
                        sx={{
                          marginLeft: "16px",
                        }}
                      />
                      <div className="text-lg font-semibold text-green-600 ml-auto text-right">
                        1,500,000 VND
                      </div>
                    </ListItem>
                  ))}
                </List>
                {visibleHotels.length < hotels.length && (
                  <div className="text-center mt-4">
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleShowMore}
                    >
                      Xem thêm{" "}
                      {Math.min(hotels.length - visibleHotels.length, 5)} khách
                      sạn
                      {/* {Math.min(hotels.length - visibleHotels.length, 10)} khách
                      sạn */}
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListHotelPage;
