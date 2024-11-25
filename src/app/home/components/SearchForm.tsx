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
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { useRouter } from "next/navigation";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAppContext } from "@/hooks/AppContext";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import localeData from "dayjs/plugin/localeData";
import "dayjs/locale/vi";

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
  const { setDateRange } = useAppContext();
  const router = useRouter();
  const suggestionsRef = useRef<HTMLDivElement>(null);

  const [formData, setFormData] = useState<SearchForm>({
    keyword: "",
    checkInDate: dayjs().add(1, "day").format("YYYY-MM-DD"),
    checkOutDate: dayjs().add(4, "day").format("YYYY-MM-DD"),
  });

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

  const formattedCheckInDate = capitalizeFirstLetter(
    dayjs(formData.checkInDate).format("dddd")
  );
  const formattedCheckOutDate = capitalizeFirstLetter(
    dayjs(formData.checkOutDate).format("dddd")
  );

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

  const handleDestinationClick = (destination: Destination) => {
    setFormData((prev) => ({
      ...prev,
      keyword: destination.locationName,
    }));
    setShowSuggestions(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      suggestionsRef.current &&
      !suggestionsRef.current.contains(event.target as Node)
    ) {
      setShowSuggestions(false);
    }
  };

  const handleSubmit = async () => {
    // setDateRange({
    //   dayStart: formData.checkInDate,
    //   dayEnd: formData.checkOutDate,
    // });
  };

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
            {/* Danh sách gợi ý */}
            {showSuggestions && (
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
                        onClick={() => handleDestinationClick(destination)}
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
