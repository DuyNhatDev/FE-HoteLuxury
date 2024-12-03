import React from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";

interface StatisticsSectionProps {
  hotelId?: number;
  refresh?: boolean;
}

const StatisticsSection: React.FC<StatisticsSectionProps> = ({
  hotelId,
  refresh,
}) => {
  return (
    <div>
      <Grid container spacing={1} justifyContent="space-between" wrap="nowrap">
        {/* Card 1 */}
        <Grid item>
          <Card
            sx={{
              width: 250,
              height: 140,
              backgroundColor: "#3b82f6",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                350
              </Typography>
              <Typography variant="body2">Tổng số lượng đặt phòng</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 2 */}
        <Grid item>
          <Card
            sx={{
              width: 250,
              height: 140,
              backgroundColor: "#22c55e",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                4.7
              </Typography>
              <Typography variant="body2">Trung bình cộng rating</Typography>
              <Typography variant="body2">(120 lượt đánh giá)</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 3 */}
        <Grid item>
          <Card
            sx={{
              width: 250,
              height: 140,
              backgroundColor: "#facc15",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Phòng Deluxe
              </Typography>
              <Typography variant="body2">Đặt nhiều nhất: 150 lượt</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 4 */}
        <Grid item>
          <Card
            sx={{
              width: 250,
              height: 140,
              backgroundColor: "#f97316",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h6" fontWeight="bold">
                Phòng Tiêu Chuẩn
              </Typography>
              <Typography variant="body2">Đặt ít nhất: 20 lượt</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Card 5 */}
        <Grid item>
          <Card
            sx={{
              width: 250,
              height: 140,
              backgroundColor: "#ef4444",
              color: "#fff",
            }}
          >
            <CardContent>
              <Typography variant="h5" fontWeight="bold">
                15
              </Typography>
              <Typography variant="body2">Số lượt hủy phòng</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </div>
  );
};

export default StatisticsSection;
