export interface BookingProps {
  bookingId?: number;
  roomTypeId?: number;
  userId?: number;
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
  roomNumber?: string;
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
}

export interface Row {
  status: string;
  message: string;
  data: BookingProps[];
}