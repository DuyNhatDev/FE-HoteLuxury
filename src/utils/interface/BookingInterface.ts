export interface BookingProps {
  bookingId?: number;
  roomTypeId?: number;
  userId?: number;
  hotelId?: number;
  dayStart?: string;
  dayEnd?: string;
  roomQuantity?: number;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  note?: string;
  status?: string;
  isConfirmed?: boolean;
  roomNumber?: string[];
  hotelName?: string;
  roomTypeName?: string;
  roomTypeImage?: string;
  price?: string;
  isRating?: boolean;
}

export interface Filters {
  dayStart?: string;
  dayEnd?: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  paymentMethod?: string;
  isConfirmed?: boolean;
  status?: string;
  hotelId?: number;
}

export interface Row {
  status: string;
  message: string;
  data: BookingProps[];
}
