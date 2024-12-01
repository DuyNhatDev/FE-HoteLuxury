import { Dayjs } from "dayjs";

export interface UserProps {
  email?: string;
  password?: string;
  fullname?: string;
  gender?: string;
  birthDate?: string;
  phoneNumber?: string;
  roleId?: string;
  address?: string;
  image?: string | null;
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
  fullname?: string;
  email?: string;
  phone?: string;
  birthDate?: Dayjs;
  roleId?: string;
}

export interface User {
  userId: number;
  fullname: string
}

export interface Profile {
  image?: string;
  email?: string;
  fullname?: string;
  phoneNumber?: string;
  birthDate?: string;
  gender?: string;
  address?: string;
}