import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { StatisticsResponse } from "@/utils/interface/DashboardInterface";

interface StatisticsSectionProps {
  refresh?: boolean;
  data?: StatisticsResponse;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  refresh,
  data,
}) => {
  return (
    <div>
      <Grid container spacing={1} justifyContent="space-between" wrap="nowrap">
        {/* Card 1 */}
        <Grid item>
          <Card
            sx={{
              width: 260,
              height: 170,
              backgroundColor: "#3b82f6",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" align="center">
                Số lượt đặt phòng
              </Typography>
              <Typography
                align="center"
                sx={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                {data?.totalBookingOfHotel}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item>
          <Card
            sx={{
              width: 260,
              height: 170,
              backgroundColor: "#22c55e",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" align="center">
                Điểm số
              </Typography>
              <Typography
                align="center"
                sx={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                {data?.ratingAverage}
              </Typography>
              <Typography align="center">
                ({data?.ratingQuantity} lượt đánh giá)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 */}
        <Grid item>
          <Card
            sx={{
              width: 260,
              height: 170,
              backgroundColor: "#facc15",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" align="center">
                Đặt nhiều nhất
              </Typography>
              {data?.totalBookingsByRoomType?.map((roomType) => (
                <div
                  key={roomType.maxBookings[0]?.roomTypeId}
                  style={{ marginBottom: "16px" }}
                >
                  <Typography
                    align="center"
                    sx={{ fontSize: "2rem", fontWeight: "bold" }}
                  >
                    {roomType.maxBookings[0]?.totalBookings ?? 0}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" align="center">
                    {roomType.maxBookings[0]?.roomTypeName ?? "N/A"}
                  </Typography>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4 */}
        <Grid item>
          <Card
            sx={{
              width: 260,
              height: 170,
              backgroundColor: "#f97316",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" align="center">
                Đặt ít nhất
              </Typography>
              {data?.totalBookingsByRoomType?.map((roomType) => (
                <div
                  key={roomType.minBookings[0]?.roomTypeId}
                  style={{ marginBottom: "16px" }}
                >
                  <Typography
                    align="center"
                    sx={{ fontSize: "2rem", fontWeight: "bold" }}
                  >
                    {roomType.minBookings[0]?.totalBookings ?? 0}
                  </Typography>
                  <Typography variant="h6" fontWeight="bold" align="center">
                    {roomType.minBookings[0]?.roomTypeName ?? "N/A"}
                  </Typography>
                </div>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {/* Card 5 */}
        <Grid item>
          <Card
            sx={{
              width: 260,
              height: 170,
              backgroundColor: "#ef4444",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold" align="center">
                Số lượt hủy phòng
              </Typography>
              <Typography
                align="center"
                sx={{ fontSize: "2rem", fontWeight: "bold" }}
              >
                {data?.totalCancelledBookingOfHotel}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default StatisticsSection;
