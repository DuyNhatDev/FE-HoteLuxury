export interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}

export interface HotelSuggestResponse<T> {
  data: T;
  provinces: string[];
  status: string;
  message: string;
}

export interface HotelRoomTypeResponse<T> {
  status: string;
  message: string;
  hotels: T;
}