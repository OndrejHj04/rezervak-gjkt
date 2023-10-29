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
  purpouse: string;
  instructions: string;
}

export interface Reservation {
  id: number;
  from_date: string;
  to_date: string;
  rooms: number;
  purpouse: string;
  leader: { id: number; email: string; first_name: string; last_name: string };
  groups: { name: string; description: string; owner: number }[];
  users: { id: number; email: string; first_name: string; last_name: string }[];
  users: number[];
  code: string;
  instructions: string;
}
