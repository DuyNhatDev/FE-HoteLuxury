"use client";
import React, { useState, useEffect } from "react";
import { Tabs, Tab, Box } from "@mui/material";
import BreadcrumbsNav from "@/app/info/components/BreadcrumbsNav";
import Sidebar from "@/app/info/components/Sidebar";
import TabPending from "@/app/info/trips/components/TabPending";
import TabConfirmed from "@/app/info/trips/components/TabConfirmed";
import TabInProgress from "@/app/info/trips/components/TabInProgress";
import TabCompleted from "@/app/info/trips/components/TabCompleted";
import TabCancelled from "@/app/info/trips/components/TabCancelled";

const MyTrips = () => {
  const [tabValue, setTabValue] = useState<number>(0);

  useEffect(() => {
    // Lấy trạng thái tab từ localStorage
    const savedTabValue = localStorage.getItem("activeTab");
    if (savedTabValue !== null) {
      setTabValue(Number(savedTabValue));
    }
  }, []);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
    // Lưu trạng thái tab vào localStorage
    localStorage.setItem("activeTab", newValue.toString());
  };

  return (
    <div className="py-8 px-48 bg-gray-100 min-h-screen">
      {/* Breadcrumbs */}
      <BreadcrumbsNav />

      <div className="flex gap-8">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content */}
        <div className="flex-1 bg-white shadow-md rounded-lg p-6">
          <Box>
            {/* Tabs Header */}
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              textColor="primary"
              indicatorColor="primary"
              variant="scrollable"
              scrollButtons="auto"
              aria-label="order status tabs"
            >
              <Tab label="Chờ xác nhận" />
              <Tab label="Sắp tới" />
              <Tab label="Đang thực hiện" />
              <Tab label="Đã hoàn tất" />
              <Tab label="Đã hủy" />
            </Tabs>

            {/* Tabs Content */}
            <div className="mt-4">
              {tabValue === 0 && <TabPending />}
              {tabValue === 1 && <TabConfirmed />}
              {tabValue === 2 && <TabInProgress />}
              {tabValue === 3 && <TabCompleted />}
              {tabValue === 4 && <TabCancelled />}
            </div>
          </Box>
        </div>
      </div>
    </div>
  );
};

export default MyTrips;
