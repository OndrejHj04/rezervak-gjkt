"use server";

import { getServerSession } from "next-auth";
import { query } from "./db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { toast } from "react-toastify";
import { transporter } from "./email";

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

export const getReservationList = async ({
  status,
  page,
  search,
  limit = 10,
  type,
  col,
  dir,
  notStatus,
  limited,
}: {
  status?: any;
  page?: any;
  search?: any;
  limit?: any;
  type?: any;
  col?: any;
  dir?: any;
  notStatus?: any;
  limited?: any;
} = {}) => {
  const {
    user: { role, id },
  } = (await getServerSession(authOptions)) as any;
  const isLimited = role.id > 2;

  const [reservations, count] = (await Promise.all([
    query({
      query: `
        SELECT reservations.id, from_date, to_date, reservations.name, purpouse, leader, status, creation_date,
        JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status,
        JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader, 
        GROUP_CONCAT(
            DISTINCT groups.name
          ) as groups,
        GROUP_CONCAT(DISTINCT userId) as users,
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', rooms.id, 'people', rooms.people)
        ) as rooms
        FROM reservations
        INNER JOIN status ON status.id = reservations.status
        INNER JOIN users ON users.id = reservations.leader
        LEFT JOIN reservations_rooms ON reservations_rooms.reservationId = reservations.id
        LEFT JOIN rooms ON rooms.id = reservations_rooms.roomId
        LEFT JOIN reservations_groups ON reservations_groups.reservationId = reservations.id
        LEFT JOIN groups ON reservations_groups.groupId = groups.id 
        LEFT JOIN users_reservations ON users_reservations.reservationId = reservations.id
        WHERE 1=1
        ${status ? `AND status.id = ${status}` : ""}
        ${limited && isLimited ? `AND reservations.leader = ${id}` : ""}
        ${search ? `AND reservations.name LIKE "%${search}%"` : ""}
        ${
          notStatus?.length
            ? notStatus.map((stat: any) => `AND status.id <> ${stat}`).join(" ")
            : ""
        }
        ${type === "expired" ? `AND to_date < CURDATE()` : ""}
        GROUP BY reservations.id
        ${col && dir ? `ORDER BY ${col} ${dir.toUpperCase()}` : ""}
        ${page ? `LIMIT ${limit || 10} OFFSET ${page * limit - limit}` : ""}
      `,
      values: [],
    }),
    query({
      query: `
      SELECT COUNT(*) as total FROM reservations
      INNER JOIN status ON reservations.status = status.id
      WHERE 1=1
      ${status ? `AND status.id = ${status}` : ""}
      ${search ? `AND reservations.name LIKE "%${search}%"` : ""}
        ${limited && isLimited ? `AND reservations.leader = ${id}` : ""}
      ${
        notStatus?.length
          ? notStatus.map((stat: any) => `AND status.id <> ${stat}`).join(" ")
          : ""
      }
      ${type === "expired" ? `AND to_date < CURDATE()` : ""}
      `,
      values: [],
    }),
  ])) as any;

  const data = reservations.map((reservation: any) => ({
    ...reservation,
    leader: JSON.parse(reservation.leader),
    status: JSON.parse(reservation.status),
    groups: reservation.groups ? reservation.groups.split(",") : [],
    users: reservation.users ? reservation.users.split(",").map(Number) : [],
    rooms: JSON.parse(`[${reservation.rooms}]`).filter(
      ({ id }: { id: any }) => id
    ),
  }));

  return { data, count: count[0].total };
};

export const reservationsAddGroups = async ({
  reservation,
  groups,
}: {
  reservation: any;
  groups: any;
}) => {
  const values = groups.flatMap((group: any) => [
    reservation,
    group,
    [reservation, group].join(","),
  ]);

  const placeholder = groups.map(() => "(?,?,?)").join(", ");

  const [result] = (await Promise.all([
    query({
      query: `INSERT IGNORE INTO reservations_groups (reservationId, groupId, id) VALUES ${placeholder}`,
      values,
    }),
  ])) as any;

  if (result.affectedRows === groups.length) {
    return { success: true, affected: result.affectedRows };
  }
  return { success: false };
};

export const sendEmail = async ({
  send,
  to,
  template,
  variables,
}: {
  send: any;
  to: any;
  template: any;
  variables: any;
}) => {
  if (!send) {
    return { success: false, msg: "Email sent is forbidden." };
  }

  function MakeEmailText(text: any, variables: any) {
    variables.map((item: any) => {
      text = text.replace("${" + item.name + "}", item.value);
    });
    return text;
  }

  const mail = await transporter.sendMail({
    from: process.env.EMAIL_ADRESS,
    to,
    subject: template.title,
    html: MakeEmailText(template.text, variables),
  });

  if (mail.accepted.length === to.length) {
    return { success: true };
  }
  return { success: false };
};

export const mailEventDetail = async ({ id }: { id: any }) => {
  const event = (await query({
    query: `
      SELECT events_children.id, primary_txt, secondary_txt, active, variables,
      JSON_OBJECT('id', templates.id, 'name', templates.name, 'title', templates.title, 'text', templates.text) as template 
      FROM events_children LEFT JOIN templates ON templates.id = events_children.template WHERE events_children.id = ?
  `,
    values: [id],
  })) as any;

  const data = {
    ...event[0],
    template: JSON.parse(event[0].template),
    variables: event[0].variables.split(","),
  };

  return { data };
};

export const userAddGroups = async ({
  user,
  groups,
}: {
  user: any;
  groups: any;
}) => {
  const eventId = 5;
  const values = groups.flatMap((newGroup: any) => [
    user,
    newGroup,
    [user, newGroup].join(","),
  ]);

  const placeholders = groups.map(() => "(?,?,?)").join(",");

  const [{ affectedRows }, userDetail, { data: template }, groupsData] =
    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_groups (userId, groupId, id) VALUES ${placeholders}`,
        values,
      }),
      query({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [user],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT groups.name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner, 
      COUNT(users_groups.groupId) as users
      FROM groups INNER JOIN users ON groups.owner = users.id 
      INNER JOIN users_groups ON groups.id = users_groups.groupId WHERE groups.id IN(${groups.map(
        () => "?"
      )}) GROUP BY groups.id`,
        values: groups,
      }),
    ])) as any;

  const data = groupsData.map(async (group: any) => {
    group = { ...group, owner: JSON.parse(group.owner) };

    await sendEmail({
      send: template.active,
      to: userDetail[0].email,
      template: template.template,
      variables: [
        { name: "group_name", value: group.name },
        { name: "users_count", value: group.users },
        {
          name: "owner_name",
          value: group.owner.first_name + " " + group.owner.last_name,
        },
        { name: "owner_email", value: group.owner.email },
      ],
    });
  });

  return { success: affectedRows === groups.length };
};
