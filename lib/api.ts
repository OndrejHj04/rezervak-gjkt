"use server";

import { getServerSession } from "next-auth";
import { query } from "./db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { transporter } from "./email";
import dayjs from "dayjs";

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

export const userAddReservations = async ({
  user,
  reservations,
}: {
  user: any;
  reservations: any;
}) => {
  const eventId = 8;

  const values = reservations.flatMap((newReservation: any) => [
    user,
    newReservation,
    [user, newReservation].join(","),
  ]);

  const placeholders = reservations.map(() => "(?,?,?)").join(",");

  const [{ affectedRows }, { data }, userDetail, reservationsDetail] =
    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_reservations (userId, reservationId, id) VALUES ${placeholders}`,
        values,
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [user],
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner 
      FROM reservations INNER JOIN users ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id IN(${reservations.map(
        () => "?"
      )})`,
        values: [...reservations],
      }),
    ])) as any;

  reservationsDetail.map(async (res: any) => {
    res = { ...res, owner: JSON.parse(res.owner) };

    await sendEmail({
      send: data.active,
      to: userDetail[0].email,
      template: data.template,
      variables: [
        {
          name: "reservation_start",
          value: dayjs(res.from_date).format("DD.MM.YYYY"),
        },
        {
          name: "reservation_end",
          value: dayjs(res.to_date).format("DD.MM.YYYY"),
        },
        { name: "reservation_status", value: res.display_name },
        {
          name: "leader_name",
          value: res.owner.first_name + " " + res.owner.last_name,
        },
        { name: "leader_email", value: res.owner.email },
      ],
    });
  });

  return { success: affectedRows === reservations.length };
};

export const usersDelete = async ({ users }: { users: any }) => {
  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `DELETE FROM users WHERE id IN(${users.map(() => "?")})`,
      values: [...users],
    }),
    query({
      query: `DELETE FROM users_groups WHERE userId IN(${users.map(
        () => "?"
      )})`,
      values: [...users],
    }),
    query({
      query: `DELETE FROM users_reservations WHERE userId IN(${users.map(
        () => "?"
      )})`,
      values: [...users],
    }),
  ])) as any;

  return { success: affectedRows === users.length };
};

export const getUserTheme = async () => {
  const user = (await getServerSession(authOptions)) as any;

  if (user) {
    const [{ theme }] = (await query({
      query: `SELECT theme FROM users WHERE id = ?`,
      values: [user.user.id],
    })) as any;

    return { theme };
  }
  return { theme: 1 };
};

export const getUserDetail = async ({
  id,
  gpage,
  rpage,
}: {
  id: any;
  gpage: any;
  rpage: any;
}) => {
  const [user, groups, groupsCount, reservations, reservationsCount] =
    (await Promise.all([
      query({
        query: `SELECT users.id, first_name, image, last_name, email, active, verified, adress, ID_code, birth_date, JSON_OBJECT('id', roles.id, 'name', roles.name) as role FROM users INNER JOIN roles ON roles.id = users.role WHERE users.id = ?`,
        values: [id],
      }),
      query({
        query: `
      SELECT groups.id, groups.name, groups.description, 
      JSON_OBJECT('id', owner.id, 'first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner,
      GROUP_CONCAT(users_groups.userId) as users
      FROM users_groups
      INNER JOIN groups ON users_groups.groupId = groups.id 
      INNER JOIN users AS owner ON owner.id = groups.owner
      WHERE groups.id IN (
        SELECT groupId FROM users_groups WHERE userId = ?
      )
      GROUP BY groups.id
      LIMIT 5 OFFSET ?
    `,
        values: [id, gpage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM users_groups WHERE userId = ?`,
        values: [id],
      }),
      query({
        query: `SELECT reservations.id, from_date, to_date, reservations.name, JSON_OBJECT('id', users.id, 'first_name', first_name, 'last_name', last_name, 'email', email, 'image', image) as leader, JSON_OBJECT('name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status
      FROM users_reservations
      INNER JOIN reservations ON reservations.id = users_reservations.reservationId
      INNER JOIN users ON users.id = reservations.leader
      INNER JOIN status ON status.id = reservations.status
      WHERE userId = ? LIMIT 5 OFFSET ?`,
        values: [id, rpage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM users_reservations WHERE userId = ?`,
        values: [id],
      }),
    ])) as any;

  const data = {
    ...user[0],
    role: JSON.parse(user[0].role),
    reservations: {
      data: reservations.map((res: any) => ({
        ...res,
        leader: JSON.parse(res.leader),
        status: JSON.parse(res.status),
      })),
      count: reservationsCount[0].total,
    },
    groups: {
      data: groups.map((group: any) => ({
        ...group,
        owner: JSON.parse(group.owner),
        users: group.users.split(","),
      })),
      count: groupsCount[0].total,
    },
  };

  return { data };
};

export const editUserDetail = async ({ id, user }: { id: any; user: any }) => {
  let str = "";

  Object.keys(user).forEach((key, i) => {
    str += `${key} = ${user[key] ? "'" : ""}${
      Number(user[key]) || user[key].length ? user[key] : null
    }${user[key] ? "'" : ""}${Object.keys(user).length - 1 !== i ? ", " : ""}`;
  });

  (await query({
    query: `UPDATE users SET ${str} WHERE id = ${id}`,
    values: [],
  })) as any;

  const userDetail = (await query({
    query: `SELECT * FROM users WHERE id = ?`,
    values: [id],
  })) as any;

  userDetail.map((item: any) => (item.role = JSON.parse(item.role as any)));

  return { success: true };
};

export const getUserDetailByEmail = async ({ email }: { email: any }) => {
  if (!email) {
    return [];
  }
  const [data] = (await Promise.all([
    query({
      query: `
        SELECT users.*, JSON_OBJECT('id', roles.id, 'name', roles.name) as role FROM users INNER JOIN roles ON roles.id = users.role WHERE email = ?
    `,
      values: [email],
    }),
  ])) as any;

  return [{ ...data[0], role: JSON.parse(data[0].role) }];
};

export const importNewUsers = async ({ users }: { users: any }) => {
  const eventId = 1;
  const template = (await mailEventDetail({ id: eventId })) as any;

  const emails = [] as any;
  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `INSERT INTO users (first_name, last_name, email, role, password, verified, active) VALUES ${users.map(
        (user: any) => {
          user.password = Math.random().toString(36).slice(-9);
          emails.push({ email: user.email, password: user.password });
          return `("${user.first_name}", "${user.last_name}", "${user.email}", "${user.role}", MD5("${user.password}"), 0, 1)`;
        }
      )}`,
      values: [],
    }),
  ])) as any;

  emails.map(async (user: any) => {
    await sendEmail({
      send: template.data.active,
      to: user.email,
      template: template.data.template,
      variables: [
        { name: "email", value: user.email },
        { name: "password", value: user.password },
      ],
    });
  });

  return { success: affectedRows === users.length, count: affectedRows };
};

export const userLogin = async ({
  email,
  password,
}: {
  email: any;
  password: any;
}) => {
  const data = (await query({
    query: `SELECT users.*, JSON_OBJECT('id', roles.id, 'name', roles.name) as role FROM users INNER JOIN roles ON roles.id = users.role WHERE email = ? AND password = MD5(?)`,
    values: [email, password],
  })) as any;

  return { data: { ...data[0], role: JSON.parse(data[0].role) } };
};

export const createUserAccount = async ({
  first_name,
  last_name,
  email,
  role,
}: {
  first_name: any;
  last_name: any;
  email: any;
  role: any;
}) => {
  const eventId = 1;
  const password = Math.random().toString(36).slice(-9) as any;

  const check = (await query({
    query: `SELECT * FROM users WHERE email = ?`,
    values: [email],
  })) as any;

  if (check.length) {
    return { success: false, msg: "Uživatel s tímto emailem už existuje" };
  }

  const [{ affectedRows }, { data }] = (await Promise.all([
    query({
      query: `INSERT INTO users(first_name, last_name, email, role, password, verified, active) VALUES(?,?,?,?, MD5(?), 0, 1)`,
      values: [first_name, last_name, email, role, password],
    }),
    mailEventDetail({ id: eventId }),
  ])) as any;

  await sendEmail({
    send: data.active,
    to: email,
    template: data.template,
    variables: [
      { name: "email", value: email },
      { name: "password", value: password },
    ],
  });

  return { success: affectedRows === 1 };
};
