"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Destination } from "@/utils/interface/DestinationInterface";
import apiService from "@/services/api";
import {
  ApiResponse,
  HotelSuggestResponse,
} from "@/utils/interface/ApiInterface";
import { useRouter } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAppContext } from "@/hooks/AppContext";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";
import { HotelProps } from "@/utils/interface/HotelInterface";
import { FaHotel } from "react-icons/fa";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("vi");

interface SearchForm {
  keyword: string;
  checkInDate: string;
  checkOutDate: string;
}

const SearchForm = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<HotelProps[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const { setDateRange } = useAppContext();
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState<SearchForm>({
    keyword: "",
    checkInDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    checkOutDate: dayjs().add(4, "day").format("YYYY-MM-DD"),
  });
  const [displayData, setDisplayData] = useState<{
    hotels: string[];
    locations: string[];
  }>({ hotels: [], locations: [] });

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const resp = await apiService.get<ApiResponse<Destination[]>>(
          "/location"
        );
        setDestinations(resp.data.data);
      } catch (error) {
        console.log("Error fetching destinations:", error);
      }
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    const fetchSuggest = async () => {
      try {
        const params = new URLSearchParams();
        if (formData.checkInDate)
          params.append("dayStart", formData.checkInDate);
        if (formData.checkOutDate)
          params.append("dayEnd", formData.checkOutDate);
        if (formData.keyword) params.append("filter", formData.keyword);

        const resp = await apiService.get<HotelSuggestResponse<HotelProps[]>>(
          `/hotel/suggested-hotel?${params.toString()}`
        );
        const updatedSuggestions = resp.data.data;
        const updatedProvinces = formatProvinces(resp.data.provinces);

        setSuggestions(updatedSuggestions);
        setProvinces(updatedProvinces);

        setDisplayData({
          hotels: updatedSuggestions
            .map((hotel) => hotel.hotelName)
            .filter((name): name is string => name !== undefined),
          locations: Array.from(
            new Set([
              ...updatedSuggestions
                .map((hotel) => hotel.locationName)
                .filter((name): name is string => name !== undefined),
              ...updatedProvinces,
            ])
          ),
        });
      } catch (error) {
        console.log("Error fetching destinations:", error);
      }
    };

    fetchSuggest();
    //console.log("formData: ", formData);
  }, [formData]);

  // useEffect(() => {
  //   console.log("suggestions: ", suggestions);
  // }, [suggestions]);

  // useEffect(() => {
  //   console.log("provinces: ", provinces);
  // }, [provinces]);

  // useEffect(() => {
  //   console.log("displayData:", displayData);
  // }, [displayData]);

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setDateRange({
      dayStart: formData.checkInDate,
      dayEnd: formData.checkOutDate,
    });
  }, [formData]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formatProvinces = (locations: string[]): string[] => {
    return locations.map((location) =>
      location.replace(/^(tỉnh|thành phố)\s+/i, "").trim()
    );
  };

  const formattedCheckInDate = capitalizeFirstLetter(
    dayjs(formData.checkInDate).format("dddd")
  );
  const formattedCheckOutDate = capitalizeFirstLetter(
    dayjs(formData.checkOutDate).format("dddd")
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async () => {};

  return (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-11/12 max-w-xl bg-gray-200 shadow-lg rounded-md p-3">
        <form className="flex flex-col gap-4">
          {/* Thanh tìm kiếm Địa điểm */}
          <div className="w-full relative" ref={suggestionsRef}>
            <TextField
              placeholder="Bạn muốn đi đâu?"
              variant="outlined"
              fullWidth
              size="medium"
              name="keyword"
              value={formData.keyword}
              onFocus={() => setShowSuggestions(true)}
              onChange={handleInputChange}
              className="bg-white"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnIcon style={{ color: "#9e9e9e" }} />
                  </InputAdornment>
                ),
              }}
            />

            {/* Danh sách gợi ý khi không nhập từ khóa tìm kiếm */}
            {showSuggestions && formData.keyword.trim() === "" && (
              <div className="absolute z-10 left-0 right-0 max-h-64 overflow-auto bg-white px-4 pb-4 pt-2">
                <Typography
                  variant="h6"
                  gutterBottom
                  className="mb-2 text-xs font-bold"
                >
                  Địa điểm đang HOT nhất
                </Typography>

                <Grid container spacing={2} className="justify-center">
                  {destinations.map((destination) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      key={destination.locationId}
                    >
                      <Card
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            keyword: destination.locationName,
                          }));
                          setShowSuggestions(false);
                        }}
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          overflow: "hidden",
                          borderRadius: "0",
                          boxShadow: "none",
                          transition: "background-color 0.3s ease",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#c9c2c28d")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor =
                            "transparent")
                        }
                      >
                        <CardMedia
                          component="img"
                          style={{
                            width: "50px",
                            height: "50px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          image={`http://localhost:9000/uploads/${destination.locationImage}`}
                          alt={destination.locationName}
                        />
                        <CardContent style={{ flex: "1", padding: "10px" }}>
                          <Typography
                            variant="body1"
                            fontWeight="normal"
                            style={{
                              fontSize: "0.8rem",
                              marginBottom: "5px",
                            }}
                          >
                            {destination.locationName}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}

            {/* Danh sách gợi ý khi nhập từ khóa tìm kiếm */}
            {showSuggestions && formData.keyword.trim() !== "" && (
              <div className="absolute px-5 pb-2 z-10 left-0 right-0 max-h-96 overflow-auto bg-white border border-gray-300 shadow-lg rounded-lg">
                {/* Group Khách sạn */}
                <div className="flex items-center my-2 bg-gray-100 rounded-md p-1">
                  <FaHotel className="mb-2 ml-1 mr-2 text-gray-600" />
                  <Typography
                    variant="h6"
                    gutterBottom
                    className="ml-1 text-sm font-semibold text-gray-700"
                  >
                    Khách sạn
                  </Typography>
                </div>
                <Grid container spacing={1}>
                  {displayData.hotels.slice(0, 10).map((hotel, index) => (
                    <Grid item xs={12} key={`hotel-${index}`}>
                      <Card
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          overflow: "hidden",
                          borderRadius: "4px",
                          boxShadow: "none",
                          padding: "2px 15px",
                          transition: "background-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "white")
                        }
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            keyword: hotel,
                          }));
                          setShowSuggestions(false);
                        }}
                      >
                        <Typography
                          variant="body1"
                          style={{
                            fontSize: "0.9rem",
                            color: "#333",
                          }}
                        >
                          {hotel}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>

                {/* Group Địa điểm */}
                <div className="flex items-center mt-4 mb-2 bg-gray-100 rounded-md p-1">
                  <LocationOnIcon className="mb-2 mr-2 text-gray-600" />
                  <Typography
                    variant="h6"
                    gutterBottom
                    className="text-sm font-semibold text-gray-700"
                  >
                    Địa điểm
                  </Typography>
                </div>
                <Grid container spacing={1}>
                  {displayData.locations.slice(0, 10).map((location, index) => (
                    <Grid item xs={12} key={`location-${index}`}>
                      <Card
                        style={{
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          overflow: "hidden",
                          borderRadius: "4px",
                          boxShadow: "none",
                          padding: "2px 15px",
                          transition: "background-color 0.2s ease",
                          backgroundColor: "white",
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.backgroundColor = "#f0f0f0")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.backgroundColor = "white")
                        }
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            keyword: location,
                          }));
                          setShowSuggestions(false);
                        }}
                      >
                        <Typography
                          variant="body1"
                          style={{
                            fontSize: "0.9rem",
                            color: "#333",
                          }}
                        >
                          {location}
                        </Typography>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-grow sm:w-1/4">
              <TextField
                label={`Ngày nhận phòng: ${formattedCheckInDate}`}
                type="date"
                variant="outlined"
                fullWidth
                size="medium"
                name="checkInDate"
                value={formData.checkInDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                className="bg-white"
              />
            </div>

            <div className="flex-grow sm:w-1/4">
              <TextField
                label={`Ngày trả phòng: ${formattedCheckOutDate}`}
                type="date"
                variant="outlined"
                fullWidth
                size="medium"
                name="checkOutDate"
                value={formData.checkOutDate}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
                className="bg-white"
              />
            </div>

            <div className="flex-none">
              <Button
                variant="contained"
                color="primary"
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3"
                onClick={handleSubmit}
              >
                Tìm
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SearchForm;
