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
import { useAppContext } from "@/hooks/AppContext";

const ListHotelPage = () => {
  const [hotels, setHotels] = useState<HotelProps[]>([]);
  const [visibleHotels, setVisibleHotels] = useState<HotelProps[]>([]);
  const {location, setLocation} = useAppContext();
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
            ? stars.filter((star) => star !== value) // Bỏ giá trị nếu đã chọn
            : [...stars, value], // Thêm giá trị nếu chưa chọn
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
        const params = new URLSearchParams();
        if (location.locationName) params.append("filter", location.locationName);
        if (formData.hotelName) params.append("hotelName", formData.hotelName);
        if (formData.hotelStar?.length)
          params.append("hotelStar", formData.hotelStar.join(","));
        if (formData.hotelType?.length)
          params.append("hotelType", formData.hotelType.join(","));
        //console.log("param: ", params.toString());
        const resp = await apiService.get<ApiResponse<HotelProps[]>>(
          `/hotel/user-filter?${params.toString()}`
        );
        const fetchedHotels = resp.data.data || [];
        setHotels(fetchedHotels);
        setVisibleHotels(fetchedHotels.slice(0, 5)); // Hiển thị tối đa
        //setVisibleHotels(fetchedHotels.slice(0, 10)); // Hiển thị tối đa
      } catch (error) {
        console.log("Error fetching hotels:", error);
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
    <div className="bg-gray-50 py-4">
      <div className="container mx-auto">
        {/* Hàng ngang cho h1 và form */}
        <div className="flex items-center mb-3">
          <h1 className="text-2xl font-bold w-[450px]">
            Khách sạn {location.locationName}
          </h1>
          <form className="flex gap-4 items-center p-3 rounded-lg bg-gray-200">
            <div className="flex flex-col items-start bg-white p-2 rounded-md shadow w-full sm:w-auto h-12 overflow-hidden">
              {/* Tên địa điểm */}
              <p className="text-xs font-semibold text-gray-800 truncate">
                {location.locationName}
              </p>

              {/* Số lượng khách sạn */}
              <p className="text-xs text-blue-500">{hotels.length} khách sạn</p>
            </div>

            <div className="flex-grow sm:w-auto">
              <TextField
                label="Ngày nhận phòng"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                size="small"
                className="bg-white"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 48,
                  },
                }}
              />
            </div>
            <div className="flex-grow sm:w-auto">
              <TextField
                label="Ngày trả phòng"
                type="date"
                variant="outlined"
                InputLabelProps={{ shrink: true }}
                size="small"
                className="bg-white"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    height: 48,
                  },
                }}
              />
            </div>
            <Button
              variant="contained"
              color="primary"
              className="bg-orange-500 hover:bg-orange-600 text-white px-6"
            >
              Tìm
            </Button>
          </form>
        </div>

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
                <List className="p-0">
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
