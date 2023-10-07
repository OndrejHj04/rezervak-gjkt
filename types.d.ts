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
}

export interface Group {
  id: number;
  name: string;
  description: string;
  users: number[];
  owner: GroupOwner;
}
