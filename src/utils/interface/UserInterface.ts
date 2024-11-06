import { Dayjs } from "dayjs";

export interface UserProps {
  email: string;
  password: string;
  fullname: string;
  gender: string;
  birthDate: string;
  phoneNumber: string;
  roleId: string;
  address: string;
  image: string | null;
}

export interface ApiResponse<T> {
  data: T;
  status: string;
  message: string;
}

export interface Row {
  status: string;
  message: string;
  data: Data[];
}

export interface Data {
  fullname: string;
  email: string;
  phoneNumber: string;
  birthDate: Dayjs;
  roleId: string;
  image: string;
  userId: number;
}

export interface Filters {
  fullname: string;
  email: string;
  phone: string;
  birthDate: Dayjs | null;
  roleId: string | null;
};