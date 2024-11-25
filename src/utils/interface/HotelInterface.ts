export interface Filters {
  hotelName?: string;
  hotelType?: string;
  hotelPhoneNumber?: string;
  hotelStar?: number;
  locationId?: number;
  hotelAddress?: string;
}

export interface Row {
  status: string;
  message: string;
  data: Data[];
}

export interface Data {
  hotelName: string;
  hotelType: string;
  hotelPhoneNumber: string;
  userId: number;
  hotelStar: number;
  hotelDescription: string;
  locationId: number;
  locationName: string;
  hotelId: number;
  hotelAddress: string;
}

export interface Hotel {
  hotelId: number;
  hotelName?: string;
}

export interface HotelProps {
  hotelName?: string;
  hotelType?: string;
  hotelPhoneNumber?: string;
  userId?: number;
  hotelStar?: number;
  hotelDescription?: string;
  hotelAddress?: string;
  locationId?: number;
  hotelId?: number;
  hotelImage?: string | null;
  minPrice?: string
}

// export interface HotelFilter {
//   hotelName?: string;
//   hotelStar?: number;
//   hotelType?: string;
// }

export interface HotelFilter {
  hotelName?: string;
  hotelStar?: number[];
  hotelType?: string[];
}
