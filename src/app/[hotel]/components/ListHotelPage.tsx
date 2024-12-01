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
  FormControl,
  RadioGroup,
  Radio,
  IconButton,
} from "@mui/material";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { HotelFilter, HotelProps } from "@/utils/interface/HotelInterface";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAppContext } from "@/hooks/AppContext";
import SearchForm from "@/app/[hotel]/components/SearchForm";
import { usePathname, useRouter } from "next/navigation";
import { convertToSlug } from "@/utils/convert-fornat/convert-format";

const ListHotelPage = () => {
  const [hotels, setHotels] = useState<HotelProps[]>([]);
  const [visibleHotels, setVisibleHotels] = useState<HotelProps[]>([]);
  const { location, dateRange, keyword, setHotelId } = useAppContext();
  const pathname = usePathname();
  const router = useRouter();
  const [isClient, setIsClient] = useState<boolean>(false);
  const [formData, setFormData] = useState<HotelFilter>({
    hotelName: "",
    hotelStar: [],
    hotelType: [],
    minPrice: "",
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
      if (key === "minPrice") {
        return {
          ...prev,
          minPrice: value,
        };
      }

      return {
        ...prev,
        [key]: value,
      };
    });
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const params = new URLSearchParams();
        if (dateRange.dayStart) params.append("dayStart", dateRange.dayStart);
        if (dateRange.dayEnd) params.append("dayEnd", dateRange.dayEnd);
        if (location.locationName)
          params.append("filter", location.locationName);
        if (keyword) params.append("filter", keyword);
        if (formData.hotelName) params.append("hotelName", formData.hotelName);
        if (formData.hotelStar?.length)
          params.append("hotelStar", formData.hotelStar.join(","));
        if (formData.hotelType?.length)
          params.append("hotelType", formData.hotelType.join(","));
        if (formData.minPrice) {
          switch (formData.minPrice) {
            case "under_500":
              params.append("minPrice", "0,500000");
              break;
            case "500_1000":
              params.append("minPrice", "500000,1000000");
              break;
            case "1000_2000":
              params.append("minPrice", "1000000,2000000");
              break;
            case "2000_5000":
              params.append("minPrice", "2000000,5000000");
              break;
            case "above_5000":
              params.append("minPrice", "5000000,100000000");
              break;
            default:
              break;
          }
        }
        const resp = await apiService.get<ApiResponse<HotelProps[]>>(
          `/hotel/user-filter?${params.toString()}`
        );
        const fetchedHotels = resp.data.data || [];
        setHotels(fetchedHotels);
        setVisibleHotels(fetchedHotels.slice(0, 5)); // Hiển thị tối đa
        //setVisibleHotels(fetchedHotels.slice(0, 10));
      } catch (error) {
        console.log("Error fetching hotels:", error);
      }
    };
    fetchHotels();
  }, [formData, dateRange.dayStart, dateRange.dayEnd]);

  const handleShowMore = () => {
    setVisibleHotels((prevVisible) => [
      ...prevVisible,
      ...hotels.slice(prevVisible.length, prevVisible.length + 5),
      //...hotels.slice(prevVisible.length, prevVisible.length + 10),
    ]);
  };

  return (
    <div className="bg-gray-50 pt-2 pb-4 relative">
      <div className="container mx-auto ml-36 flex-wrap">
        <IconButton
          className="!absolute !top-0 !left-0 !m-4 !z-10"
          onClick={() => {
            router.back();
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        {/* Hàng ngang cho h1 và form */}
        <div className="flex items-center mb-3">
          <h1 className="text-2xl font-bold w-full max-w-[400px] text-left text-gray-800">
            {isClient ? (
              <>
                <span className="text-black font-semibold">
                  {keyword || location.locationName}
                </span>
                <span className="text-blue-600 font-normal">
                  : {hotels.length} Khách sạn
                </span>
              </>
            ) : (
              "Đang tải..."
            )}
          </h1>
          <SearchForm />
        </div>

        <div className="flex gap-5">
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

            <div className="border-t border-gray-200 my-4"></div>

            {/* Lọc theo Giá */}
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Giá</h3>
              <FormControl component="fieldset">
                <RadioGroup
                  value={formData.minPrice || ""}
                  onChange={(e) =>
                    handleFilterChange("minPrice", e.target.value)
                  }
                >
                  {[
                    { label: "Tất cả", value: "" },
                    { label: "Dưới 500.000", value: "under_500" },
                    { label: "Từ 500.000 - 1.000.000", value: "500_1000" },
                    { label: "Từ 1.000.000 - 2.000.000", value: "1000_2000" },
                    { label: "Từ 2.000.000 - 5.000.000", value: "2000_5000" },
                    { label: "Trên 5.000.000", value: "above_5000" },
                  ].map((price) => (
                    <FormControlLabel
                      key={price.value}
                      value={price.value}
                      control={<Radio size="small" />}
                      label={price.label}
                      className="text-sm"
                    />
                  ))}
                </RadioGroup>
              </FormControl>
            </div>
          </aside>

          {/* Hotel List */}
          <div className="w-3/5">
            {hotels.length === 0 ? (
              <p className="text-lg text-center text-gray-600 px-4 py-2">
                Không tìm thấy khách sạn phù hợp
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
                        width: "900px",
                        alignItems: "center",
                        transition: "box-shadow 0.3s ease, border 0.3s ease",
                        border: "1px solid #e0e0e0",
                        ":hover": {
                          border: "1px solid #007BFF",
                        },
                        borderRadius: "8px",
                      }}
                      onClick={() => {
                        if (hotel.hotelId !== undefined) {
                          setHotelId(hotel.hotelId.toString());
                        }
                        router.push(
                          `${pathname}/${convertToSlug(
                            hotel.hotelName || ""
                          )}-chi-tiet`
                        );
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
                          <div style={{ maxWidth: "380px" }}>
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
                          <div style={{ maxWidth: "380px" }}>
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
                          maxWidth: "380px",
                          overflow: "hidden",
                        }}
                      />
                      <div className="text-lg font-semibold text-green-600 ml-auto text-right">
                        {Number(hotel.minPrice).toLocaleString("vi-VN")} VND
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
