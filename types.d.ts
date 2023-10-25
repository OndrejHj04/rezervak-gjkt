import { User } from "next-auth";

export interface Role {
  id: number;
  role_name: string;
  role_color: string;
}

export interface GroupOwner {
  id: number;
  image: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface Group {
  id: number;
  name: string;
  description: string;
  users: GroupOwner[] | number[];
  owner: GroupOwner;
}

export interface NewReservation {
  from_date: string;
  to_date: string;
  groups: number[];
  members: number[];
  rooms: number;
  leader: number;
  purpose: string;
}

export interface Reservations {
  id: number;
  from_date: string;
  to_date: string;
  rooms: number;
  purpose: string;
  leader: id;
  groups: number[];
  users: number[];
  code: string;
}
