export interface StatisticsResponse {
  status: string;
  message: string;
  ratingQuantity: number;
  ratingAverage: number;
  totalBookingOfHotel: number;
  totalCancelledBookingOfHotel: number;
  totalBookingsByRoomType: TotalBookingsByRoomType[];
  totalBookingOfHotelByTime: TotalBookingByTime[];
  totalRevenueOfHotelByTime: TotalRevenueByTime[];
  theMostBookingUser: MostBookingUser[];
}

export interface TotalBookingsByRoomType {
  maxBookings: RoomTypeBooking[];
  minBookings: RoomTypeBooking[];
}

export interface RoomTypeBooking {
  totalBookings: number;
  roomTypeId: number;
  roomTypeName: string;
}

export interface TotalBookingByTime {
  _id: {
    month: string;
  };
  totalBookings: number;
}

export interface TotalRevenueByTime {
  _id: {
    month: string;
  };
  totalRevenue: number;
}

export interface MostBookingUser {
  theMostBookingUser: UserBookingInfo[];
}

export interface UserBookingInfo {
  totalBookings: number;
  userId: number;
  fullname: string;
  phoneNumber: string;
  email: string;
  address: string;
  image: string;
  birthDate: string;
}
