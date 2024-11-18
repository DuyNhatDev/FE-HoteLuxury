export interface Filters {
  hotelId?: number;
  roomTypeQuantity?: number;
  roomTypeName?: string;
  roomTypePrice?: string;
  maxPeople?: number;
}

export interface Row {
  status: string;
  message: string;
  data: Data[];
}

export interface Data {
  roomTypeId: number;
  hotelId?: number;
  roomTypeQuantity?: number;
  roomTypeName?: string;
  roomTypePrice?: string;
  roomTypeDescription?: string;
  maxPeople: number;
}

export interface RoomTypeProps {
  roomTypeId?: number;
  hotelId?: number;
  roomTypeQuantity?: number;
  roomTypeName?: string;
  roomTypePrice?: string;
  roomTypeDescription?: string;
  maxPeople?: number;
  roomTypeImage?: string | null;
}
