"use server";

import { getServerSession } from "next-auth";
import { query } from "./db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { transporter } from "./email";
import dayjs from "dayjs";
import { rolesConfig } from "./rolesConfig";
import { decode, sign } from "jsonwebtoken";

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

export const userRemoveGroups = async ({
  user,
  groups,
}: {
  user: any;
  groups: any;
}) => {
  const eventId = 6;

  const [{ affectedRows }, { data }, groupsDetail, userDetail] =
    (await Promise.all([
      query({
        query: `DELETE FROM users_groups WHERE userId = ? AND groupId IN (${groups.map(
          () => "?"
        )})`,
        values: [user, ...groups],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT groups.name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner
      FROM groups INNER JOIN users ON users.id = groups.owner WHERE groups.id IN(${groups.map(
        () => "?"
      )})`,
        values: [...groups],
      }),
      query({
        query: `SELECT email FROM users WHERE id = ?`,
        values: [user],
      }),
    ])) as any;

  groupsDetail.map(async (detail: any) => {
    detail = { ...detail, owner: JSON.parse(detail.owner) };

    await sendEmail({
      send: data.active,
      to: userDetail[0].email,
      template: data.template,
      variables: [
        { name: "group_name", value: detail.name },
        {
          name: "owner_name",
          value: detail.owner.first_name + " " + detail.owner.last_name,
        },
        { name: "owner_email", value: detail.owner.email },
      ],
    });
  });

  return { success: affectedRows === groups.length };
};

export const userRemoveReservations = async ({
  user,
  reservations,
}: {
  user: any;
  reservations: any;
}) => {
  const eventId = 9;

  const [{ affectedRows }, { data }, userDetail, reservationsDetails] =
    (await Promise.all([
      query({
        query: `DELETE FROM users_reservations WHERE userId = ? AND reservationId  IN(${reservations.map(
          () => "?"
        )})`,
        values: [user, ...reservations],
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

  reservationsDetails.map(async (res: any) => {
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

export const makeUserSleep = async ({
  id,
  active,
}: {
  id: any;
  active: any;
}) => {
  const eventId = 3;

  const [{ affectedRows }, user] = (await Promise.all([
    query({
      query: `UPDATE users SET active = ? WHERE id = ?`,
      values: [!active, id],
    }),
    query({
      query: `SELECT email FROM users WHERE id = ?`,
      values: [id],
    }),
  ])) as any;

  const data = (await mailEventDetail({ id: eventId })) as any;

  await sendEmail({
    send: data.active,
    to: user[0].email,
    template: data.template,
    variables: [{ name: "email", value: user[0].email }],
  });

  return {
    success: affectedRows === 1,
    msg: active === 0 ? "Uživatel byl probuzen" : "Uživatel byl uspán",
  };
};

export const validateImport = async ({ data }: { data: any }) => {
  const validData = data.filter((item: any) =>
    item.every((row: any) => row.length)
  );

  const value = (await query({
    query: `SELECT email FROM users WHERE email IN (${validData
      .map((item: any) => `"${item[2]}"`)
      .join(",")})`,
  })) as any;

  const set = new Set();

  value.map((item: any) => {
    set.add(item.email);
  });

  return {
    data: validData.map((valid: any) => [...valid, !set.has(valid[2])]),
  };
};

export const getRolesList = async ({ filter }: { filter: any }) => {
  const {
    user: { role },
  } = (await getServerSession(authOptions)) as any;

  if (!filter) {
    const data = await query({
      query: `SELECT * FROM roles`,
    });
    return { data };
  }

  const thisRoles = rolesConfig.users.modules.userCreate.options[
    role.id as never
  ] as any;

  if (thisRoles.length === 0) {
    return { data: [] };
  }

  const data = await query({
    query: `
    SELECT * FROM roles WHERE id IN(${thisRoles.map(() => "?")})
  `,
    values: [...thisRoles],
  });
  return { data };
};

export const resetUserPassword = async ({
  password,
  id,
  token,
}: {
  password: any;
  id: any;
  token: any;
}) => {
  const { exp } = decode(token) as any;

  if (dayjs(exp).isBefore(dayjs())) {
    return { success: false };
  }

  const [{ affectedRows }] = (await query({
    query: `UPDATE users SET password = MD5(?) WHERE id = ?`,
    values: [password, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const sendResetPasswordEmail = async ({ email }: { email: any }) => {
  const eventId = 4;

  const users = (await query({
    query: `SELECT  id, email FROM users WHERE email = ?`,
    values: [email],
  })) as any;
  if (users.length) {
    const tkn = sign(
      {
        exp: dayjs().add(1, "day").unix() * 1000,
        id: users[0].id,
      },
      "Kraljeliman"
    );

    const template = await mailEventDetail({ id: eventId });

    await sendEmail({
      send: template.data.active,
      to: email,
      template: template.data.template,
      variables: [
        {
          name: "link",
          value: `${process.env.NEXT_PUBLIC_API_URL}/password-reset/form?id=${users[0].id}&token=${tkn}`,
        },
      ],
    });

    return { success: true };
  }
  return { success: false };
};

export const reservationAddUsers = async ({
  reservation,
  users,
}: {
  reservation: any;
  users: any;
}) => {
  const eventId = 8;

  const values = users.flatMap((user: any) => [
    user,
    reservation,
    [user, reservation].join(","),
  ]);

  const placeholder = users.map(() => "(?,?,?)").join(", ");

  const [{ affectedRows }, { data }, reservationDetail, usersEmails] =
    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_reservations (userId, reservationId, id) VALUES ${placeholder}`,
        values,
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner 
      FROM reservations INNER JOIN users ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id = ?`,
        values: [reservation],
      }),
      query({
        query: `SELECT email FROM users WHERE id IN(${users.map(() => "?")})`,
        values: [...users],
      }),
    ])) as any;

  const res = {
    ...reservationDetail[0],
    owner: JSON.parse(reservationDetail[0].owner),
  };

  await sendEmail({
    send: data.active,
    to: usersEmails.map(({ email }: { email: any }) => email),
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

  return { success: affectedRows === users.length };
};

export const setBlockedDates = async ({
  from_date,
  to_date,
  userId,
}: {
  from_date: any;
  to_date: any;
  userId: any;
}) => {
  const fromDate = dayjs(from_date).format("YYYY-MM-DD");
  const toDate = dayjs(to_date).format("YYYY-MM-DD");

  const [_, { affectedRows: affectedRows }] = (await Promise.all([
    query({
      query: `UPDATE reservations SET status = 4 WHERE ((from_date BETWEEN '${fromDate}' AND '${toDate}') OR (to_date BETWEEN '${fromDate}' AND '${toDate}')) AND status <> 5 AND status <> 1`,
      values: [],
    }),
    query({
      query: `INSERT INTO reservations (from_date, to_date, name, status, leader, purpouse, instructions, creation_date) 
      VALUES ("${fromDate}", "${toDate}", "Blokace", 5, ${userId}, "blokace", "", ${dayjs().format(
        "YYYY-MM-DD"
      )})`,
      values: [],
    }),
  ])) as any;

  return {
    success: affectedRows === 1,
    from_date,
    to_date,
  };
};

export const createNewReservation = async ({
  from_date,
  to_date,
  leader,
  rooms,
  groups,
  purpouse,
  members,
  instructions,
  name,
}: {
  from_date: any;
  to_date: any;
  leader: any;
  rooms: any;
  groups: any;
  purpouse: any;
  members: any;
  instructions: any;
  name: any;
}) => {
  const eventId = 8;

  const reservation = (await query({
    query: `INSERT INTO reservations (from_date, to_date, purpouse, leader, instructions, name, status, creation_date)
    VALUES ("${dayjs(from_date).format("YYYY-MM-DD")}", "${dayjs(
      to_date
    ).format(
      "YYYY-MM-DD"
    )}", "${purpouse}", "${leader}", "${instructions}", "${name}", 2, "${dayjs(
      new Date()
    ).format("YYYY-MM-DD")}")`,
    values: [],
  })) as any;

  const [{ data }, leaderData, statusName, membersEmail] = (await Promise.all([
    mailEventDetail({ id: eventId }),
    query({
      query: `SELECT first_name, last_name, email FROM users WHERE id = ?`,
      values: [leader],
    }),
    query({
      query: `SELECT display_name FROM status WHERE id = 2`,
    }),
    query({
      query: `SELECT email FROM users WHERE id IN(${members.map(() => "?")})`,
      values: [...members],
    }),
    query({
      query: `INSERT INTO reservations_rooms (reservationId, roomId, id) VALUES ${rooms.map(
        () => "(?,?,?)"
      )}`,
      values: rooms.flatMap((room: any) => [
        reservation.insertId,
        room,
        [room, reservation.insertId].join(","),
      ]),
    }),
    members.length &&
      query({
        query: `INSERT INTO users_reservations (userId, reservationId, id) VALUES ${members
          .map(() => "(?,?,?)")
          .join(", ")}`,
        values: members.flatMap((member: any) => [
          member,
          reservation.insertId,
          [member, reservation.insertId].join(","),
        ]),
      }),
    groups.length &&
      query({
        query: `INSERT INTO reservations_groups (reservationId, groupId, id) VALUES ${groups
          .map(() => "(?,?,?)")
          .join(", ")}`,
        values: groups.flatMap((group: any) => [
          reservation.insertId,
          group,
          [group, reservation.insertId].join(","),
        ]),
      }),
  ])) as any;

  await sendEmail({
    send: data.active,
    to: membersEmail.map(({ email }: { email: any }) => email),
    template: data.template,
    variables: [
      {
        name: "reservation_start",
        value: dayjs(from_date).format("DD.MM.YYYY"),
      },
      {
        name: "reservation_end",
        value: dayjs(to_date).format("DD.MM.YYYY"),
      },
      { name: "reservation_status", value: statusName[0].display_name },
      {
        name: "leader_name",
        value: leaderData[0].first_name + " " + leaderData[0].last_name,
      },
      { name: "leader_email", value: leaderData[0].email },
    ],
  });

  return { success: true };
};

export const reservationsDelete = async ({
  reservations,
}: {
  reservations: any;
}) => {
  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `DELETE FROM reservations WHERE id IN(${reservations.map(
        () => "?"
      )})`,
      values: [...reservations],
    }),
    query({
      query: `DELETE FROM reservations_groups WHERE reservationId IN(${reservations.map(
        () => "?"
      )})`,
      values: [...reservations],
    }),
    query({
      query: `DELETE FROM users_reservations WHERE reservationId IN(${reservations.map(
        () => "?"
      )})`,
      values: [...reservations],
    }),
    query({
      query: `DELETE FROM reservations_rooms WHERE reservationId IN(${reservations.map(
        () => "?"
      )})`,
      values: [...reservations],
    }),
  ])) as any;

  return { success: affectedRows === reservations.length };
};

export const getReservationDetail = async ({
  id,
  upage,
  gpage,
}: {
  id: any;
  upage: any;
  gpage: any;
}) => {
  const [reservations, users, usersCount, groups, groupsCount] =
    (await Promise.all([
      query({
        query: `SELECT reservations.id, from_date, to_date, reservations.name, leader, instructions, purpouse, creation_date, 
    JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', display_name, 'icon', icon) as status,
    JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader,
    GROUP_CONCAT(
      JSON_OBJECT('id', rooms.id, 'people', rooms.people)
    ) as rooms
    FROM reservations
    INNER JOIN reservations_rooms ON reservations_rooms.reservationId = reservations.id
    INNER JOIN status ON reservations.status = status.id
    INNER JOIN users ON users.id = reservations.leader
    INNER JOIN rooms ON roomId = rooms.id
    WHERE reservations.id = ?
    GROUP BY reservations.id
    `,
        values: [id],
      }),
      query({
        query: `SELECT users.id, first_name, last_name, image, email FROM users_reservations INNER JOIN users ON users.id = userId WHERE reservationId = ? LIMIT 5 OFFSET ?`,
        values: [id, upage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM users_reservations WHERE reservationId = ?`,
        values: [id],
      }),
      query({
        query: `
        SELECT groups.id, groups.name, description, GROUP_CONCAT(DISTINCT userId) as users
        FROM reservations_groups
        INNER JOIN groups ON reservations_groups.groupId = groups.id
        LEFT JOIN users_groups ON groups.id = users_groups.groupId
        WHERE reservationId = ?
        GROUP BY groups.id
        LIMIT 5 OFFSET ?
        `,
        values: [id, gpage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM reservations_groups WHERE reservationId = ?`,
        values: [id],
      }),
    ])) as any;

  const data = reservations.length && {
    ...reservations[0],
    status: JSON.parse(reservations[0].status),
    leader: JSON.parse(reservations[0].leader),
    rooms: JSON.parse(`[${reservations[0].rooms}]`),
    users: {
      data: users,
      count: usersCount[0].total,
    },
    groups: {
      data: groups.map((group: any) => ({
        ...group,
        users: group.users ? group.users.split(",") : [],
      })),
      count: groupsCount[0].total,
    },
  };

  return { data };
};

export const editReservationDetail = async ({
  id,
  purpouse,
  instructions,
  name,
}: {
  id: any;
  purpouse: any;
  instructions: any;
  name: any;
}) => {
  const { affectedRows } = (await query({
    query: `UPDATE reservations SET purpouse = ?, name = ?, instructions = ? WHERE id = ?`,
    values: [purpouse, name, instructions, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const setReservationsArchive = async () => {
  const { affectedRows } = (await query({
    query: `UPDATE reservations SET status = 1 WHERE status <> 1 AND to_date < CURDATE()`,
    values: [],
  })) as any;

  return { count: affectedRows };
};

export const reservationRemoveGroups = async ({
  reservation,
  groups,
}: {
  reservation: any;
  groups: any;
}) => {
  const { affectedRows } = (await query({
    query: `DELETE FROM reservations_groups WHERE reservationId = ? AND groupId IN(${groups.map(
      () => "?"
    )})`,
    values: [reservation, ...groups],
  })) as any;

  return { success: affectedRows === groups.length };
};

export const reservationRemoveUsers = async ({
  reservation,
  users,
}: {
  reservation: any;
  users: any;
}) => {
  const eventId = 9;

  const [{ affectedRows }, { data }, usersEmails, reservationDetail] =
    (await Promise.all([
      query({
        query: `DELETE FROM users_reservations WHERE reservationId = ? AND userId IN(${users.map(
          () => "?"
        )})`,
        values: [reservation, ...users],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT email FROM users WHERE id IN(${users.map(() => "?")})`,
        values: [...users],
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader 
      FROM reservations INNER JOIN users ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id = ?`,
        values: [reservation],
      }),
    ])) as any;

  const res = {
    ...reservationDetail[0],
    leader: JSON.parse(reservationDetail[0].leader),
  };

  await sendEmail({
    send: data.active,
    to: usersEmails.map(({ email }: { email: any }) => email),
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
      {
        name: "reservation_status",
        value: res.display_name,
      },
      {
        name: "leader_name",
        value: res.leader.first_name + " " + res.leader.last_name,
      },
      { name: "leader_email", value: res.leader.email },
    ],
  });

  return { success: affectedRows === users.length };
};

export const getReservationsStatus = async ({ filter }: { filter: any }) => {
  const data = (await query({
    query: `SELECT * FROM status ${filter ? "WHERE id <> 5" : ""}`,
    values: [],
  })) as any;

  return data;
};

export const reservationUpdateStatus = async ({
  id,
  oldStatus,
  newStatus,
}: {
  id: any;
  oldStatus: any;
  newStatus: any;
}) => {
  const eventId = 10;

  const [reservation, { affectedRows }, { data }] = (await Promise.all([
    query({
      query: `SELECT reservations.from_date, reservations.status, reservations.name, reservations.to_date, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader,
      GROUP_CONCAT(distinct users.email) as emails FROM reservations LEFT JOIN users_reservations ON users_reservations.reservationId = reservations.id 
        INNER JOIN status ON status.id = reservations.status
        INNER JOIN users ON users_reservations.userId = users.id
        INNER JOIN users as leader ON leader.id = reservations.leader
       WHERE reservations.id = ? GROUP BY reservations.id`,
      values: [id],
    }),
    query({
      query: `UPDATE reservations SET status = ${newStatus} WHERE id = ${id}`,
      values: [],
    }),
    mailEventDetail({ id: eventId }),
  ])) as any;

  const statuses = (await query({
    query: `
      SELECT status.display_name FROM status WHERE id = ?
      UNION ALL
      SELECT status.display_name FROM status WHERE id = ?
    `,
    values: [oldStatus, newStatus],
  })) as any;

  const resDetail = {
    ...reservation[0],
    leader: JSON.parse(reservation[0].leader),
  };

  await sendEmail({
    send: data.active,
    to: resDetail.emails.split(","),
    template: data.template,
    variables: [
      {
        name: "reservation_name",
        value: resDetail.name,
      },
      {
        name: "reservation_start",
        value: dayjs(resDetail.from_date).format("DD.MM.YYYY"),
      },
      {
        name: "reservation_end",
        value: dayjs(resDetail.to_date).format("DD.MM.YYYY"),
      },
      { name: "status_before", value: statuses[0].display_name },
      { name: "status_new", value: statuses[1].display_name },
      { name: "leader_email", value: resDetail.leader.email },
      {
        name: "leader_name",
        value: resDetail.leader.first_name + " " + resDetail.leader.last_name,
      },
    ],
  });

  return { success: affectedRows === 1 };
};

export const userSpecifiedReservations = async ({
  userId,
  page,
}: {
  userId: any;
  page: any;
}) => {
  const [reservations, count] = (await Promise.all([
    query({
      query: `SELECT reservations.id, from_date, to_date, status, reservations.name, leader, 
      JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status,
      JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader,
      GROUP_CONCAT(
        DISTINCT JSON_OBJECT('id', rooms.id, 'people', rooms.people)
      ) as rooms
      FROM users_reservations 
      INNER JOIN reservations ON users_reservations.reservationId = reservations.id 
      INNER JOIN status ON status.id = reservations.status
      INNER JOIN reservations_rooms ON reservations.id = reservations_rooms.reservationId
      INNER JOIN rooms ON reservations_rooms.roomId = rooms.id
      INNER JOIN users ON users.id = reservations.leader
      WHERE userId = ?
      GROUP BY reservations.id
      LIMIT 5 OFFSET ${page * 5 - 5}
      `,
      values: [userId],
    }),
    query({
      query: `SELECT COUNT(*) as total FROM users_reservations WHERE userId = ?`,
      values: [userId],
    }),
  ])) as any;

  const data = reservations.map((reservation: any) => ({
    ...reservation,
    status: JSON.parse(reservation.status),
    leader: JSON.parse(reservation.leader),
    rooms: JSON.parse(`[${reservation.rooms}]`),
  }));

  return { data, count: count[0].total };
};

export const groupAddMembers = async ({
  group,
  newMembers,
}: {
  group: any;
  newMembers: any;
}) => {
  const eventId = 5;
  const values = newMembers.flatMap((newMember: any) => [
    newMember,
    group,
    [newMember, group].join(","),
  ]);

  const placeholders = newMembers.map(() => "(?,?,?)").join(", ");

  const [{ affectedRows }, groupDetail, owner, users, reservations, template] =
    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_groups (userId, groupId, id) VALUES ${placeholders}`,
        values,
      }),
      query({
        query: `SELECT groups.* FROM groups WHERE groups.id = ?`,
        values: [group],
      }),
      query({
        query: `SELECT first_name, last_name, email FROM users INNER JOIN groups ON groups.owner = users.id WHERE groups.id = ?`,
        values: [group],
      }),
      query({
        query: `SELECT first_name, last_name, email FROM users WHERE id IN(${newMembers.map(
          () => "?"
        )})`,
        values: [...newMembers],
      }),
      query({
        query: `SELECT reservations.* FROM reservations INNER JOIN reservations_groups ON reservations.id = reservations_groups.reservationId`,
        values: [],
      }),
      mailEventDetail({ id: eventId }),
    ])) as any;

  const data = {
    ...groupDetail[0],
    owner: owner[0],
    users,
    reservations,
  };

  await sendEmail({
    send: template.data.active,
    to: users.map(({ email }: { email: any }) => email),
    template: template.data.template,
    variables: [
      { name: "group_name", value: groupDetail[0].name },
      { name: "users_count", value: users.length },
      {
        name: "owner_name",
        value: owner[0].first_name + " " + owner[0].last_name,
      },
      { name: "owner_email", value: owner[0].email },
    ],
  });

  return { success: affectedRows === newMembers.length };
};

export const groupAddReservation = async ({
  group,
  reservations,
}: {
  group: any;
  reservations: any;
}) => {
  const placeholder = reservations.map(() => "(?,?,?)");
  const values = reservations.flatMap((res: any) => [
    res,
    group,
    [res, group].join(","),
  ]);

  const { affectedRows } = (await query({
    query: `INSERT IGNORE INTO reservations_groups (reservationId, groupId, id) VALUES ${placeholder}`,
    values,
  })) as any;

  return { success: affectedRows === reservations.length };
};

export const createNewGroup = async ({
  name,
  description,
  owner,
}: {
  name: any;
  description: any;
  owner: any;
}) => {
  const { insertId, affectedRows } = (await query({
    query: `INSERT INTO groups (name, description, owner) VALUES (?,?,?)`,
    values: [name, description, owner],
  })) as any;

  await query({
    query: `INSERT IGNORE INTO users_groups (userId, groupId, id) VALUES ("${owner}", "${insertId}", ${JSON.stringify(
      `${owner},${insertId}`
    )})`,
  });

  return { success: affectedRows === 1, id: insertId };
};

export const getGroupDetail = async ({
  id,
  upage,
  rpage,
}: {
  id: any;
  upage: any;
  rpage: any;
}) => {
  const [group, reservations, resCount, users, usersCount] = (await Promise.all(
    [
      query({
        query: `SELECT groups.id, name, description, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as owner FROM groups INNER JOIN users ON users.id = groups.owner WHERE groups.id = ?`,
        values: [id],
      }),
      query({
        query: `SELECT reservations.id, from_date, to_date, name, status FROM reservations 
    INNER JOIN reservations_groups ON reservations.id = reservations_groups.reservationId 
    WHERE reservations_groups.groupId = ? LIMIT 5 OFFSET ?`,
        values: [id, rpage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) AS total FROM reservations_groups WHERE reservations_groups.groupId = ?`,
        values: [id],
      }),
      query({
        query: `SELECT users.id, first_name, last_name, email, image FROM users 
    INNER JOIN users_groups ON users.id = users_groups.userId 
    WHERE users_groups.groupId = ? LIMIT 5 OFFSET ?`,
        values: [id, upage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) AS total FROM users_groups WHERE users_groups.groupId = ?`,
        values: [id],
      }),
    ]
  )) as any;

  const data = {
    ...group[0],
    owner: JSON.parse(group[0].owner),
    reservations: { data: reservations, count: resCount[0].total },
    users: { data: users, count: usersCount[0].total },
  };

  return { data };
};

export const groupDetailEdit = async ({
  name,
  description,
  id,
}: {
  name: any;
  description: any;
  id: any;
}) => {
  const { affectedRows } = (await query({
    query: `
      UPDATE ${"`groups`"} SET name = ?, description = ? WHERE id = ?`,
    values: [name, description, id],
  })) as any;

  return { success: affectedRows === 1 };
};
