"use client";
import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
} from "@mui/material";
import Image from "next/image";
import { Destination } from "@/utils/interface/DestinationInterface";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

interface SearchForm {
  keyword: string;
  checkInDate: string;
  checkOutDate: string;
}

const HomePage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false); // Trạng thái hiển thị danh sách gợi ý
  const router = useRouter();
  const today = dayjs();
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

  const handleDestinationClick = (destination: Destination) => {
    setFormData((prev) => ({
      ...prev,
      keyword: destination.locationName,
    }));
    setShowSuggestions(false); // Ẩn gợi ý khi chọn địa điểm
  };

  return (
    <div className="relative">
      {/* Hình nền */}
      <div className="relative h-[350px] w-full">
        <Image
          src="/images/home-bg.png"
          alt="Background"
          className="object-fill"
          fill
        />

        {/* Form tìm kiếm nằm giữa */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-11/12 max-w-xl bg-white shadow-lg rounded-md p-3">
            <form className="flex flex-col gap-4">
              {/* Thanh tìm kiếm Địa điểm */}
              <div className="w-full relative">
                <TextField
                  label="Bạn muốn đi đâu?"
                  variant="outlined"
                  fullWidth
                  name="keyword"
                  value={formData.keyword}
                  onFocus={() => setShowSuggestions(true)} // Hiển thị gợi ý khi focus
                  onChange={handleInputChange}
                  className="bg-white"
                />
                {/* Danh sách gợi ý */}
                {showSuggestions && (
                  <div className="absolute z-10 left-0 right-0 mt-2 max-h-64 overflow-auto bg-white shadow-lg rounded-md p-4">
                    <Typography variant="h6" gutterBottom className="mb-4">
                      Địa điểm đang HOT nhất
                    </Typography>
                    <Grid container spacing={2} className="justify-center">
                      {destinations.map((destination) => (
                        <Grid
                          item
                          xs={12}
                          sm={6}
                          md={4} // 3 items trên mỗi dòng khi màn hình lớn
                          key={destination.locationId}
                        >
                          <Card
                            onClick={() => handleDestinationClick(destination)}
                            style={{
                              cursor: "pointer",
                              borderRadius: "8px",
                              display: "flex",
                              alignItems: "center",
                              boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                              transition: "transform 0.2s ease",
                              overflow: "hidden",
                            }}
                            onMouseEnter={(e) =>
                              (e.currentTarget.style.transform = "scale(1.02)")
                            }
                            onMouseLeave={(e) =>
                              (e.currentTarget.style.transform = "scale(1)")
                            }
                          >
                            {/* Hình ảnh */}
                            <CardMedia
                              component="img"
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                              image={`http://localhost:9000/uploads/${destination.locationImage}`}
                              alt={destination.locationName}
                            />
                            {/* Nội dung */}
                            <CardContent style={{ flex: "1", padding: "10px" }}>
                              <Typography
                                variant="body1"
                                fontWeight="bold"
                                style={{
                                  fontSize: "1rem",
                                  marginBottom: "5px",
                                }}
                              >
                                {destination.locationName}
                              </Typography>
                              {/* <Typography
                                variant="body2"
                                color="textSecondary"
                                style={{ fontSize: "0.9rem" }}
                              >
                                {destination.locationId} KS
                              </Typography> */}
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
                )}
              </div>

              {/* Thanh Ngày đến, Ngày đi, Số người và nút Tìm */}
              <div className="flex flex-wrap gap-4 items-center">
                <div className="flex-grow sm:w-1/4">
                  <TextField
                    label="Ngày nhận phòng"
                    type="date"
                    variant="outlined"
                    fullWidth
                    name="checkInDate"
                    value={formData.checkInDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                <div className="flex-grow sm:w-1/4">
                  <TextField
                    label="Ngày trả phòng"
                    type="date"
                    variant="outlined"
                    fullWidth
                    name="checkOutDate"
                    value={formData.checkOutDate}
                    onChange={handleInputChange}
                    InputLabelProps={{ shrink: true }}
                  />
                </div>

                {/* Nút Tìm */}
                <div className="flex-none">
                  <Button
                    variant="contained"
                    color="primary"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6"
                  >
                    Tìm
                  </Button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Danh sách địa điểm nổi bật */}
      <div className="container mx-auto py-8">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Địa điểm nổi bật
        </h2>
        <Grid container spacing={4}>
          {destinations.map((destination) => (
            <Grid
              item
              xs={12}
              sm={4} // 1 dòng có 3 địa điểm
              key={destination.locationId}
            >
              <Card
                onClick={() => {
                  const location = {
                    locationId: destination.locationId,
                    locationName: destination.locationName,
                  };
                  sessionStorage.setItem("location", JSON.stringify(location));
                  router.push(
                    `/khach-san-${destination.locationName.toLowerCase()}`
                  );
                }}
                style={{
                  cursor: "pointer",
                  borderRadius: "8px",
                  overflow: "hidden",
                }}
              >
                <CardMedia
                  component="img"
                  height="140"
                  image={`http://localhost:9000/uploads/${destination.locationImage}`}
                  alt={destination.locationName}
                />
                <CardContent>
                  <Typography
                    variant="body1"
                    fontWeight="bold"
                    textAlign="center"
                  >
                    {destination.locationName}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    textAlign="center"
                  >
                    {destination.locationId} KS
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
    </div>
  );
};

export default HomePage;
