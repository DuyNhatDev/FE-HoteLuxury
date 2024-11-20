export interface Filters {
  hotelId?: number;
  roomTypeId?: number;
  roomNumber?: string;
}

export interface Row {
  status: string;
  message: string;
  data: Data[];
}

export interface RoomType {
  hotelId: number;
  roomTypeId: number;
}

export interface Data {
  roomId: number;
  roomTypeId: RoomType;
  roomNumber: string;
}

export interface RoomProps {
  hotelId?: number;
  roomId?: number;
  roomTypeId?: number;
  roomNumber?: string;
}

export interface RoomUpdate {
  roomTypeId: RoomType;
  roomNumber: string;
}
