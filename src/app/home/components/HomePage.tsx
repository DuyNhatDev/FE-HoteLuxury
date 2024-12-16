"use client";
import React, { useEffect, useState } from "react";
import { ImageList, ImageListItem, ImageListItemBar } from "@mui/material";
import Image from "next/image";
import { Destination } from "@/utils/interface/DestinationInterface";
import apiService from "@/services/api";
import { ApiResponse } from "@/utils/interface/ApiInterface";
import { useRouter } from "next/navigation";
import SearchForm from "@/app/home/components/SearchForm";
import { useAppContext } from "@/hooks/AppContext";
import { convertToSlug } from "@/utils/convert-fornat/convert-format";

const HomePage = () => {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const { setLocation, setKeyword } = useAppContext();
  const router = useRouter();

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
        <SearchForm />
      </div>

      <div className="container mx-auto py-8">
        <h2 className="text-center text-2xl font-semibold mb-6">
          Địa điểm nổi bật
        </h2>
        <ImageList
          sx={{
            width: "100%",
            maxWidth: "80%",
            height: "auto",
            margin: "0 auto",
          }}
          cols={4}
          gap={24}
        >
          {destinations.slice(0, 12).map((destination) => (
            <ImageListItem
              key={destination.locationId}
              onClick={() => {
                setKeyword("");
                setLocation({
                  locationId: destination.locationId,
                  locationName: destination.locationName,
                });
                router.push(
                  `/khach-san-${convertToSlug(destination.locationName)}`
                );
              }}
              className="group cursor-pointer w-[280px] h-[250px] mx-auto overflow-hidden rounded-lg relative"
            >
              {/* Hình ảnh */}
              <img
                src={`https://be-hote-luxury.vercel.app/uploads/${destination.locationImage}?w=600&h=600&fit=crop&auto=format`}
                srcSet={`https://be-hote-luxury.vercel.app/uploads/${destination.locationImage}?w=600&h=600&fit=crop&auto=format&dpr=2 2x`}
                alt={destination.locationName}
                loading="lazy"
                className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-105 group-hover:brightness-90"
              />

              {/* Tên địa điểm */}
              <div className="text-center font-bold text-xl text-gray-800 mt-2">
                {destination.locationName}
              </div>
            </ImageListItem>
          ))}
        </ImageList>
      </div>
    </div>
  );
};

export default HomePage;
