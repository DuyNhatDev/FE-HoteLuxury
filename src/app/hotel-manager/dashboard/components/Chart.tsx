import React from "react";
import { Typography } from "@mui/material";

interface ChartSectionProps {
  hotelId?: number;
  refresh?: boolean;
}

const ChartSection: React.FC<ChartSectionProps> = ({ hotelId, refresh }) => {
  return (
    <div>
      <Typography variant="h5" fontWeight="bold">
        Biểu đồ
      </Typography>
    </div>
  );
};

export default ChartSection;
