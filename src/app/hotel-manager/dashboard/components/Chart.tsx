import { Typography, Box } from "@mui/material";
import { BarChart, LineChart } from "@mui/x-charts";
import { StatisticsResponse } from "@/utils/interface/DashboardInterface";

interface ChartSectionProps {
  refresh?: boolean;
  data?: StatisticsResponse;
}

const ChartSection: React.FC<ChartSectionProps> = ({ refresh, data }) => {
  const bookingsData = (data?.totalBookingOfHotelByTime || []).map((item) => ({
    month: `Tháng ${item._id.month}`,
    totalBookings: item.totalBookings || 0,
  }));

  const revenueData = (data?.totalRevenueOfHotelByTime || []).map((item) => ({
    month: `Tháng ${item._id.month}`,
    totalRevenue: item.totalRevenue || 0,
  }));

  return (
    <div>
      <Typography variant="h5" fontWeight="bold" mb={2} align="center">
        Biểu đồ thống kê
      </Typography>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "8rem",
        }}
      >
        {/* Biểu đồ Tổng Số Lượt Đặt Phòng */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <div>
            <Typography variant="h6" fontWeight="medium" mb={1} align="center">
              Số lượt đặt phòng theo tháng
            </Typography>
            {bookingsData.length > 0 ? (
              <BarChart
                width={500}
                height={370}
                series={[
                  {
                    dataKey: "totalBookings",
                    label: "Lượt đặt phòng",
                  },
                ]}
                dataset={bookingsData}
                xAxis={[{ dataKey: "month", scaleType: "band" }]}
                yAxis={[{ dataKey: "totalBookings" }]}
              />
            ) : (
              <Typography variant="body1">
                Không có dữ liệu để hiển thị.
              </Typography>
            )}
          </div>
        </div>

        {/* Biểu đồ Doanh Thu */}
        <div
          style={{
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "10px",
          }}
        >
          <div>
            <Typography variant="h6" fontWeight="medium" mb={1} align="center">
              Doanh thu theo tháng
            </Typography>
            {revenueData.length > 0 ? (
              <LineChart
                width={500}
                height={370}
                series={[
                  {
                    dataKey: "totalRevenue",
                    label: "Doanh thu (VND)",
                  },
                ]}
                dataset={revenueData}
                xAxis={[{ dataKey: "month", scaleType: "band" }]}
                yAxis={[{ dataKey: "totalRevenue" }]}
              />
            ) : (
              <Typography variant="body1">
                Không có dữ liệu để hiển thị.
              </Typography>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartSection;
