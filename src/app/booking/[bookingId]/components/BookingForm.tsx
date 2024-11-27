import { useAppContext } from '@/hooks/AppContext';
import apiService from '@/services/api';
import { ApiResponse } from '@/utils/interface/ApiInterface';
import { HotelProps } from '@/utils/interface/HotelInterface';
import { RoomTypeProps } from '@/utils/interface/RoomTypeInterface';
import React, { useEffect, useState } from 'react'

const BookingForm = () => {
 const [hotel, setHotel] = useState<HotelProps>({});
 const [roomType, setRoomType] = useState<RoomTypeProps>({});
 const { hotelId, roomTypeId, dateRange } = useAppContext();

 useEffect(() => {
   const fetchHotel = async () => {
     try {
       const resp = await apiService.get<ApiResponse<HotelProps>>(
         `hotel/${hotelId}`
       );
       setHotel(resp.data.data);
     } catch (error) {
       console.log("Error fetching hotel:", error);
     }
   };

   fetchHotel();
 }, []);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const resp = await apiService.get<ApiResponse<RoomTypeProps>>(
          `roomType/${roomTypeId}`
        );
        setHotel(resp.data.data);
      } catch (error) {
        console.log("Error fetching hotel:", error);
      }
    };

    fetchHotel();
  }, []);

  return (
    <div>
      
    </div>
  )
}

export default BookingForm
