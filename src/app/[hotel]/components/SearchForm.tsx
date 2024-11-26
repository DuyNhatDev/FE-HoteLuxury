"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  TextField,
  Button,
  Grid,
  Card,
  Typography,
  InputAdornment,
} from "@mui/material";
import { Destination } from "@/utils/interface/DestinationInterface";
import apiService from "@/services/api";
import { HotelSuggestResponse } from "@/utils/interface/ApiInterface";
import { useRouter } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAppContext } from "@/hooks/AppContext";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";
import { HotelProps } from "@/utils/interface/HotelInterface";
import {
  convertToSlug,
  formatProvinces,
} from "@/utils/convert-fornat/convert-format";
import { FaHotel } from "react-icons/fa";

dayjs.extend(weekday);
dayjs.extend(localeData);
dayjs.locale("vi");

interface SearchForm {
  keyword: string | null;
  checkInDate: string | null;
  checkOutDate: string | null;
}

const SearchForm = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<HotelProps[]>([]);
  const [provinces, setProvinces] = useState<string[]>([]);
  const {
    dateRange,
    setDateRange,
    keyword,
    setKeyword,
    location,
    setLocation,
  } = useAppContext();
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const [isClient, setIsClient] = useState(false);

  const [formData, setFormData] = useState<SearchForm>({
    keyword: keyword ? keyword : location.locationName,
    checkInDate: dateRange.dayStart,
    checkOutDate: dateRange.dayEnd,
  });

  const [displayData, setDisplayData] = useState<{
    hotels: string[];
    locations: string[];
  }>({ hotels: [], locations: [] });

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;

    if (name === "checkInDate") {
      const today = dayjs().format("YYYY-MM-DD");
      if (value < today) {
        setFormData((prev) => ({
          ...prev,
          [name]: today,
        }));
        return;
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  useEffect(() => {
    setIsClient(true);
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
    console.log("formData: ", formData);
  }, [formData]);

  const handleSubmit = () => {
    setDateRange({
      dayStart: formData.checkInDate,
      dayEnd: formData.checkOutDate,
    });

    if (formData.keyword === "") {
      setShowSuggestions(true);
      return;
    }
    setDateRange({
      dayStart: formData.checkInDate,
      dayEnd: formData.checkOutDate,
    });
    setKeyword(formData.keyword);
    setLocation({ locationId: null, locationName: null });
    router.push(`/khach-san-${convertToSlug(formData.keyword || "")}`);
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const formattedCheckInDate = isClient
    ? capitalizeFirstLetter(dayjs(formData.checkInDate).format("dddd"))
    : "";

  const formattedCheckOutDate = isClient
    ? capitalizeFirstLetter(dayjs(formData.checkOutDate).format("dddd"))
    : "";

  return (
    <div className="relative w-11/12 max-w-4xl ml-1 bg-gray-200 bg-opacity-30 shadow-lg rounded-md p-3 backdrop-blur-none">
      <form className="flex gap-3 items-center">
        {/* Ô tìm kiếm Địa điểm */}
        <div className="relative flex-grow w-[50%]" ref={suggestionsRef}>
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
        </div>

        {showSuggestions && (
          <div className="absolute left-0 right-0 pb-2 z-10 bg-white border border-gray-300 shadow-lg rounded-lg top-[60px] max-h-[500px] w-[400px] overflow-auto">
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

        {/* Ô Ngày nhận phòng */}
        <div className="flex-grow w-[25%]">
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

        {/* Ô Ngày trả phòng */}
        <div className="flex-grow w-[25%]">
          <TextField
            label={`Ngày nhận phòng: ${formattedCheckOutDate}`}
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

        {/* Nút Tìm */}
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
      </form>
    </div>
  );
};

export default SearchForm;
