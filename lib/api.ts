"use server";

import { query } from "./db";

export const getUserList = async ({
  page,
  search,
  role,
  rpp = 10,
}: {
  page?: any;
  search?: any;
  role?: any;
  rpp?: any;
} = {}) => {
  const [users, count] = (await Promise.all([
    query({
      query: `SELECT users.id, first_name, last_name, email, image, verified, birth_date, active, JSON_OBJECT('id', roles.id, 'name', roles.name) as role
            FROM users INNER JOIN roles ON roles.id = users.role WHERE 1=1
          ${
            search
              ? `AND (users.first_name LIKE "%${search}%" OR users.last_name LIKE "%${search}%")`
              : ""
          }
          ${role ? `AND users.role = ${role}` : ""}
          ${page ? `LIMIT ${rpp} OFFSET ${page * rpp - rpp}` : ""}`,
      values: [],
    }),
    query({
      query: `SELECT COUNT(*) as total FROM users WHERE 1=1 
          ${
            search
              ? `AND (users.first_name LIKE "%${search}%" OR users.last_name LIKE "%${search}%")`
              : ""
          }
          ${role ? `AND users.role = ${role}` : ""}
          `,
      values: [],
    }),
  ])) as any;

  const data = users.map((user: any) => ({
    ...user,
    role: JSON.parse(user.role),
  }));

  return { data, count: count[0].total };
};
