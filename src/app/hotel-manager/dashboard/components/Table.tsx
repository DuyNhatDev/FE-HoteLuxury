import React from "react";
import { Typography } from "@mui/material";

interface TableSectionProps {
  hotelId?: string;
  refresh?: boolean;
}

const TableSection: React.FC<TableSectionProps> = ({ hotelId, refresh }) => {
  return (
    <div>
      <Typography variant="h5" fontWeight="bold">
        Table
      </Typography>
    </div>
  );
};

export default TableSection;
