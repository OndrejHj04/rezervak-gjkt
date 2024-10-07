"use server";

import { getServerSession } from "next-auth";
import { query } from "./db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { transporter } from "./email";
import dayjs from "dayjs";
import { rolesConfig } from "./rolesConfig";
import { decode, sign } from "jsonwebtoken";

const checkUserSession = async () => {
  const user = (await getServerSession(authOptions)) as any;
  return user?.user.email === "host@nemazat.cz";
};

export const getUserList = async ({
  page,
  search,
  role,
  organization,
  rpp = 10,
  withChildrenCollapsed = false,
}: {
  page?: any;
  search?: any;
  role?: any;
  organization?: any;
  rpp?: any;
  withChildrenCollapsed?: any;
} = {}) => {
  const guest = await checkUserSession();

  const [users, count] = (await Promise.all([
    query({
      query: `SELECT users.id, users.first_name, users.last_name, users.email, users.image, users.verified, users.birth_date, users.active, JSON_OBJECT('id', organization.id, 'name', organization.name) as organization, JSON_OBJECT('id', roles.id, 'name', roles.name) as role
      
${withChildrenCollapsed
          ? `      ,GROUP_CONCAT(DISTINCT JSON_OBJECT(
        'id', children_detail.id, 
        'first_name', children_detail.first_name, 
        'last_name', children_detail.last_name, 
        'email', children_detail.email, 
        'image', children_detail.image, 
        'verified', children_detail.verified, 
        'birth_date', users.birth_date, 
        'active', users.active,
        'organization', JSON_OBJECT(
            'id', children_organization.id, 
            'name', children_organization.name
        ), 
        'role', JSON_OBJECT(
            'id', children_roles.id, 
            'name', children_roles.name
        )
    )
) AS children`
          : ""
        }


            FROM users${guest ? "_mock as users" : ""
        } INNER JOIN roles ON roles.id = users.role
             LEFT JOIN organization ON organization.id = users.organization
${withChildrenCollapsed
          ? `             LEFT JOIN children_accounts ON children_accounts.parentId = users.id
             LEFT JOIN users as children_detail ON children_detail.id = children_accounts.childrenId
             LEFT JOIN roles as children_roles ON children_roles.id = children_detail.role
             LEFT JOIN organization as children_organization ON children_organization.id = children_detail.organization`
          : ""
        }
            WHERE 1=1
                  ${withChildrenCollapsed
          ? `AND NOT EXISTS (SELECT 1 FROM children_accounts WHERE children_accounts.childrenId = users.id)`
          : ""
        }
          ${search
          ? `AND (users.first_name LIKE "%${search}%" OR users.last_name LIKE "%${search}%")`
          : ""
        }
          ${role ? `AND users.role = ${role}` : ""}
          ${organization ? `AND users.organization = ${organization}` : ""}
          GROUP BY users.id
          ${page ? `LIMIT ${rpp} OFFSET ${page * rpp - rpp}` : ""}`,
      values: [],
    }),
    query({
      query: `SELECT COUNT(*) as total FROM users WHERE 1=1 
      ${withChildrenCollapsed
          ? `AND NOT EXISTS (SELECT 1 FROM children_accounts WHERE children_accounts.childrenId = users.id)`
          : ""
        }
          ${search
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
    organization: JSON.parse(user.organization).id
      ? JSON.parse(user.organization)
      : null,
    children:
      user.children && JSON.parse(`[${user.children}]`)[0].id
        ? JSON.parse(`[${user.children}]`)
        : [],
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
  const guest = await checkUserSession();

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
        FROM reservations${guest ? "_mock as reservations" : ""}
        INNER JOIN status ON status.id = reservations.status
        INNER JOIN users${guest ? "_mock as users" : ""
        } ON users.id = reservations.leader
        LEFT JOIN reservations_rooms${guest ? "_mock as reservations_rooms" : ""
        } ON reservations_rooms.reservationId = reservations.id
        LEFT JOIN rooms ON rooms.id = reservations_rooms.roomId
        LEFT JOIN reservations_groups${guest ? "_mock as reservations_groups" : ""
        } ON reservations_groups.reservationId = reservations.id
        LEFT JOIN groups${guest ? "_mock as groups" : ""
        } ON reservations_groups.groupId = groups.id 
        LEFT JOIN users_reservations${guest ? "_mock as users_reservations" : ""
        } ON users_reservations.reservationId = reservations.id
        WHERE 1=1
        ${status ? `AND status.id = ${status}` : ""}
        ${limited && isLimited ? `AND reservations.leader = ${id}` : ""}
        ${search ? `AND reservations.name LIKE "%${search}%"` : ""}
        ${notStatus?.length
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
      SELECT COUNT(*) as total FROM reservations${guest ? "_mock as reservations" : ""
        }
      INNER JOIN status ON reservations.status = status.id
      WHERE 1=1
      ${status ? `AND status.id = ${status}` : ""}
      ${search ? `AND reservations.name LIKE "%${search}%"` : ""}
        ${limited && isLimited ? `AND reservations.leader = ${id}` : ""}
      ${notStatus?.length
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

export const getReservationCalendarData = async ({ rooms = [] }: { rooms: any }) => {
  const guest = await checkUserSession();

  const [result] = (await Promise.all([
    query({
      query:
        `SELECT reservations.id, reservations.from_date, reservations.to_date, reservations.name, reservations.creation_date, reservations.purpouse,
        reservations.leader, reservations.status, JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name) as leader, 
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', rooms.id, 'people', rooms.people)
        ) as rooms
          FROM reservations
        INNER JOIN status ON status.id = reservations.status
        INNER JOIN users ON users.id = reservations.leader 
        LEFT JOIN reservations_rooms ON reservations_rooms.reservationId = reservations.id
        LEFT JOIN rooms ON reservations_rooms.roomId = rooms.id
        WHERE 1=1
        ${rooms.length ? `AND ${rooms.map((item: any, index: any) => index === rooms.length - 1 ? `rooms.id = ${item}` : `rooms.id = ${item} OR`).join(" ")}` : ''}
        GROUP BY reservations.id
        `
    })
  ])) as any

  const data = result.map((item: any) => ({
    ...item,
    leader: JSON.parse(item.leader),
    status: JSON.parse(item.status),
    rooms: JSON.parse(`[${item.rooms}]`).filter(
      ({ id }: { id: any }) => id
    ),
  }))

  return { data }
}

export const reservationsAddGroups = async ({
  reservation,
  groups,
}: {
  reservation: any;
  groups: any;
}) => {
  const guest = await checkUserSession();
  const values = groups.flatMap((group: any) => [
    reservation,
    group,
    [reservation, group].join(","),
  ]);

  const placeholder = groups.map(() => "(?,?,?)").join(", ");

  const [result] = (await Promise.all([
    query({
      query: `INSERT IGNORE INTO reservations_groups${guest ? "_mock" : ""
        } (reservationId, groupId, id) VALUES ${placeholder}`,
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
  const guest = await checkUserSession();

  if (!send || guest) {
    return { success: false, msg: "Email sent is forbidden." };
  }

  function MakeEmailText(text: any, variables: any) {
    variables.map((item: any) => {
      text = text.replace("${" + item.name + "}", item.value);
    });
    return text;
  }
  const mailContent = MakeEmailText(template.text, variables)
  const mail = await transporter.sendMail({
    from: process.env.EMAIL_ADRESS,
    to,
    subject: template.title,
    html: mailContent
  });

  await query({
    query: `INSERT IGNORE INTO emails (recipients, date, subject, content) VALUES (?,CURRENT_TIMESTAMP(),?,?)`,
    values: [mail.accepted.toString(), template.title, mailContent]
  })

  if (mail.accepted.length === to.length) {
    return { success: true };
  }
  return { success: false };
};

export const mailEventDetail = async ({ id }: { id: any }) => {
  const guest = await checkUserSession();

  const event = (await query({
    query: `
      SELECT events_children.id, primary_txt, secondary_txt, active, variables,
      JSON_OBJECT('id', templates.id, 'name', templates.name, 'title', templates.title, 'text', templates.text) as template 
      FROM events_children${guest ? "_mock as events_children" : ""
      } LEFT JOIN templates${guest ? "_mock as templates" : ""
      } ON templates.id = events_children.template WHERE events_children.id = ?
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
  const guest = await checkUserSession();
  const placeholders = groups.map(() => "(?,?,?)").join(",");

  const [{ affectedRows }, userDetail, { data: template }, groupsData] =
    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_groups${guest ? "_mock" : ""
          } (userId, groupId, id) VALUES ${placeholders}`,
        values,
      }),
      query({
        query: `SELECT email FROM users${guest ? "_mock as users" : ""
          } WHERE id = ?`,
        values: [user],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT groups.name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner, 
      COUNT(users_groups.groupId) as users
      FROM groups${guest ? "_mock as groups" : ""} INNER JOIN users${guest ? "_mock as users" : ""
          } ON groups.owner = users.id 
      INNER JOIN users_groups${guest ? "_mock as users_groups" : ""
          } ON groups.id = users_groups.groupId WHERE groups.id IN(${groups.map(
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

export const userAddChildren = async ({
  user,
  children,
}: {
  user: any;
  children: any;
}) => {
  const guest = await checkUserSession();
  const values = children.flatMap((child: any) => [
    child,
    user,
    [child, user].join(","),
  ]);
  const placeholders = children.map(() => "(?,?,?)").join(",");

  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `INSERT IGNORE INTO children_accounts${guest ? "_mock" : ""
        } (childrenId, parentId, id) VALUES ${placeholders}`,
      values,
    }),
  ])) as any;

  return { success: affectedRows === children.length };
};

export const userAddReservations = async ({
  user,
  reservations,
}: {
  user: any;
  reservations: any;
}) => {
  const eventId = 8;
  const guest = await checkUserSession();
  const values = reservations.flatMap((newReservation: any) => [
    user,
    newReservation,
    [user, newReservation].join(","),
  ]);

  const placeholders = reservations.map(() => "(?,?,?)").join(",");

  const [{ affectedRows }, { data }, userDetail, reservationsDetail] =
    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_reservations${guest ? "_mock" : ""
          } (userId, reservationId, id) VALUES ${placeholders}`,
        values,
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT email FROM users${guest ? "_mock as users" : ""
          } WHERE id = ?`,
        values: [user],
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner 
      FROM reservations${guest ? "_mock as reservations" : ""
          } INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id IN(${reservations.map(
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
  const guest = await checkUserSession();
  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `DELETE FROM users${guest ? "_mock" : ""} WHERE id IN(${users.map(
        () => "?"
      )})`,
      values: [...users],
    }),
    query({
      query: `DELETE FROM users_groups${guest ? "_mock" : ""
        } WHERE userId IN(${users.map(() => "?")})`,
      values: [...users],
    }),
    query({
      query: `DELETE FROM users_reservations${guest ? "_mock" : ""
        } WHERE userId IN(${users.map(() => "?")})`,
      values: [...users],
    }),
    query({
      query: `DELETE FROM children_accounts${guest ? "_mock" : ""
        } WHERE childrenId IN(${users.map(() => "?")})`,
      values: [...users],
    }),
  ])) as any;

  return { success: affectedRows === users.length };
};

export const getUserTheme = async () => {
  const user = (await getServerSession(authOptions)) as any;
  const guest = await checkUserSession();

  if (user) {
    const [{ theme }] = (await query({
      query: `SELECT theme FROM users${guest ? "_mock" : ""} WHERE id = ?`,
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
  chpage,
}: {
  id: any;
  gpage: any;
  rpage: any;
  chpage: any;
}) => {
  const guest = await checkUserSession();

  const [
    user,
    groups,
    userChildren,
    userChildrenCount,
    groupsCount,
    reservations,
    reservationsCount,
    isChildrenAccount,
  ] = (await Promise.all([
    query({
      query: `SELECT users.id, users.first_name, users.image, users.last_name, users.email, users.active, users.verified, users.adress, users.ID_code, users.birth_date, JSON_OBJECT('id', organization.id, 'name', organization.name) as organization, JSON_OBJECT('id', roles.id, 'name', roles.name) as role, GROUP_CONCAT(DISTINCT JSON_OBJECT('id', children_detail.id, 'first_name', children_detail.first_name, 'last_name', children_detail.last_name)) as children
        FROM users${guest ? "_mock as users" : ""
        } INNER JOIN roles ON roles.id = users.role
        LEFT JOIN organization ON  organization.id = users.organization
        LEFT JOIN children_accounts ON children_accounts.parentId = users.id
        LEFT JOIN users as children_detail ON children_accounts.childrenId = children_detail.id
        WHERE users.id = ?`,
      values: [id],
    }),
    query({
      query: `
      SELECT groups.id, groups.name, groups.description, 
      JSON_OBJECT('id', owner.id, 'first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner,
      GROUP_CONCAT(users_groups.userId) as users
      FROM users_groups${guest ? "_mock as users_groups" : ""}
      INNER JOIN groups${guest ? "_mock as groups" : ""
        } ON users_groups.groupId = groups.id 
      INNER JOIN users${guest ? "_mock as owner" : " as owner"
        } ON owner.id = groups.owner
      WHERE groups.id IN (
        SELECT groupId FROM users_groups WHERE userId = ?
      )
      GROUP BY groups.id
      LIMIT 5 OFFSET ?
    `,
      values: [id, gpage * 5 - 5],
    }),
    query({
      query: `SELECT 
   users.id, 
    users.first_name, 
    users.last_name, 
    users.image, 
    users.email
  FROM 
    children_accounts 
  LEFT JOIN 
    users ON users.id = children_accounts.childrenId 
  WHERE 
    children_accounts.parentId = ?
   LIMIT 5 OFFSET ?`,
      values: [id, chpage * 5 - 5],
    }),
    query({
      query: `SELECT 
      COUNT(*) as total
  FROM 
    children_accounts 
  LEFT JOIN 
    users ON users.id = children_accounts.childrenId 
  WHERE 
    children_accounts.parentId = ?`,
      values: [id],
    }),
    query({
      query: `SELECT COUNT(*) as total FROM users_groups${guest ? "_mock as users_groups" : ""
        } WHERE userId = ?`,
      values: [id],
    }),
    query({
      query: `SELECT reservations.id, from_date, to_date, reservations.name, JSON_OBJECT('id', users.id, 'first_name', first_name, 'last_name', last_name, 'email', email, 'image', image) as leader, JSON_OBJECT('name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status
      FROM users_reservations${guest ? "_mock as users_reservations" : ""}
      INNER JOIN reservations${guest ? "_mock as reservations" : ""
        } ON reservations.id = users_reservations.reservationId
      INNER JOIN users${guest ? "_mock as users" : ""
        } ON users.id = reservations.leader
      INNER JOIN status ON status.id = reservations.status
      WHERE userId = ? LIMIT 5 OFFSET ?`,
      values: [id, rpage * 5 - 5],
    }),
    query({
      query: `SELECT COUNT(*) as total FROM users_reservations${guest ? "_mock as users_reservations" : ""
        } WHERE userId = ?`,
      values: [id],
    }),
    query({
      query: `SELECT users.first_name, users.last_name as count FROM children_accounts ${guest ? "_mock as users_reservations" : ""
        } 
      INNER JOIN users ON children_accounts.parentId = users.id  
      WHERE childrenId = ?`,
      values: [id],
    }),
  ])) as any;

  const data = {
    ...user[0],
    children: { count: userChildrenCount[0].total, data: userChildren },
    role: JSON.parse(user[0].role),
    organization: JSON.parse(user[0].organization).id
      ? JSON.parse(user[0].organization)
      : null,
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
    parrentAccount: isChildrenAccount.length ? isChildrenAccount[0] : null
  };

  return { data };
};

export const editUserDetail = async ({ id, user }: { id: any; user: any }) => {
  let str = "";
  const guest = await checkUserSession();

  Object.keys(user).forEach((key, i) => {
    str += `${key} = ${user[key] ? "'" : ""}${Number(user[key]) || user[key].length ? user[key] : null
      }${user[key] ? "'" : ""}${Object.keys(user).length - 1 !== i ? ", " : ""}`;
  });

  (await query({
    query: `UPDATE users${guest ? "_mock as users" : ""
      } SET ${str} WHERE id = ${id}`,
    values: [],
  })) as any;

  const userDetail = (await query({
    query: `SELECT * FROM users${guest ? "_mock as users" : ""} WHERE id = ?`,
    values: [id],
  })) as any;

  userDetail.map((item: any) => (item.role = JSON.parse(item.role as any)));

  return { success: true };
};

export const getUserDetailByEmail = async ({ email }: { email: any }) => {
  if (!email) {
    return [];
  }
  const guest = await checkUserSession();

  const [data] = (await Promise.all([
    query({
      query: `
        SELECT users.*, JSON_OBJECT('id', roles.id, 'name', roles.name) as role FROM users${guest ? "_mock as users" : ""
        } INNER JOIN roles ON roles.id = users.role WHERE email = ?
    `,
      values: [email],
    }),
  ])) as any;

  return [{ ...data[0], role: JSON.parse(data[0].role) }];
};

export const importNewUsers = async ({ users }: { users: any }) => {
  const eventId = 1;
  const template = (await mailEventDetail({ id: eventId })) as any;
  const guest = await checkUserSession();

  const emails = [] as any;
  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `INSERT INTO users${guest ? "_mock" : ""
        } (first_name, last_name, email, role, password, verified, active) VALUES ${users.map(
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
  if (email === "host@nemazat.cz") {
    const data = (await query({
      query: `SELECT users.*, JSON_OBJECT('id', roles.id, 'name', roles.name) as role FROM users_mock as users INNER JOIN roles ON roles.id = users.role WHERE email = ?`,
      values: [email],
    })) as any;

    return { data: { ...data[0], role: JSON.parse(data[0].role) } };
  }
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
  parent,
}: {
  first_name: any;
  last_name: any;
  email: any;
  role: any;
  parent: any;
}) => {
  const eventId = 1;
  const password = Math.random().toString(36).slice(-9) as any;
  const guest = await checkUserSession();

  const check = (await query({
    query: `SELECT * FROM users${guest ? "_mock as users" : ""
      } WHERE email = ?`,
    values: [email],
  })) as any;

  if (check.length) {
    return { success: false, msg: "Uživatel s tímto emailem už existuje" };
  }

  const [{ affectedRows, insertId }, { data }] = (await Promise.all([
    query({
      query: `INSERT INTO users${guest ? "_mock" : ""
        }(first_name, last_name, email, role, password, verified, active) VALUES(?,?,?,?, MD5(?), 0, 1)`,
      values: [first_name, last_name, email, role, password],
    }),
    mailEventDetail({ id: eventId }),
  ])) as any;

  if (parent) {
    await query({
      query: `INSERT INTO children_accounts${guest ? "_mock" : ""
        }(childrenId, parentId, id) VALUES(?,?,?)`,
      values: [insertId, parent, `${insertId},${parent}`],
    });
  }

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
  const guest = await checkUserSession();

  const [{ affectedRows }, { data }, groupsDetail, userDetail] =
    (await Promise.all([
      query({
        query: `DELETE FROM users_groups${guest ? "_mock" : ""
          } WHERE userId = ? AND groupId IN (${groups.map(() => "?")})`,
        values: [user, ...groups],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT groups.name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner
      FROM groups${guest ? "_mock as groups" : ""} INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = groups.owner WHERE groups.id IN(${groups.map(
            () => "?"
          )})`,
        values: [...groups],
      }),
      query({
        query: `SELECT email FROM users${guest ? "_mock" : ""} WHERE id = ?`,
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

export const userRemoveChildren = async ({
  user,
  children,
}: {
  user: any;
  children: any;
}) => {
  const guest = await checkUserSession();

  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `DELETE FROM children_accounts${guest ? "_mock" : ""
        } WHERE parentId = ? AND childrenId  IN(${children.map(() => "?")})`,
      values: [user, ...children],
    }),
  ])) as any;

  return { success: affectedRows === children.length };
};

export const userRemoveReservations = async ({
  user,
  reservations,
}: {
  user: any;
  reservations: any;
}) => {
  const eventId = 9;
  const guest = await checkUserSession();

  const [{ affectedRows }, { data }, userDetail, reservationsDetails] =
    (await Promise.all([
      query({
        query: `DELETE FROM users_reservations${guest ? "_mock" : ""
          } WHERE userId = ? AND reservationId  IN(${reservations.map(
            () => "?"
          )})`,
        values: [user, ...reservations],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT email FROM users${guest ? "_mock" : ""} WHERE id = ?`,
        values: [user],
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner 
      FROM reservations${guest ? "_mock as reservations" : ""
          } INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id IN(${reservations.map(
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
  const guest = await checkUserSession();

  const [{ affectedRows }, user] = (await Promise.all([
    query({
      query: `UPDATE users${guest ? "_mock" : ""} SET active = ? WHERE id = ?`,
      values: [!active, id],
    }),
    query({
      query: `SELECT email FROM users${guest ? "_mock" : ""} WHERE id = ?`,
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
  const guest = await checkUserSession();

  const value = (await query({
    query: `SELECT email FROM users${guest ? "_mock" : ""
      } WHERE email IN (${validData
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

export const getOrganizationsList = async () => {
  const data = await query({
    query: `
    SELECT * FROM organization
  `,
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

  const { affectedRows } = (await query({
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
  const guest = await checkUserSession();

  const values = users.flatMap((user: any) => [
    user,
    reservation,
    [user, reservation].join(","),
  ]);

  const placeholder = users.map(() => "(?,?,?)").join(", ");

  const [{ affectedRows }, { data }, reservationDetail, usersEmails] =
    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_reservations${guest ? "_mock" : ""
          } (userId, reservationId, id) VALUES ${placeholder}`,
        values,
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner 
      FROM reservations${guest ? "_mock as reservations" : ""
          } INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id = ?`,
        values: [reservation],
      }),
      query({
        query: `SELECT email FROM users${guest ? "_mock" : ""
          } WHERE id IN(${users.map(() => "?")})`,
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
  const guest = await checkUserSession();

  const [_, { affectedRows: affectedRows }] = (await Promise.all([
    query({
      query: `UPDATE reservations${guest ? "_mock" : ""
        } SET status = 4 WHERE ((from_date BETWEEN '${fromDate}' AND '${toDate}') OR (to_date BETWEEN '${fromDate}' AND '${toDate}')) AND status <> 5 AND status <> 1`,
      values: [],
    }),
    query({
      query: `INSERT INTO reservations${guest ? "_mock" : ""
        } (from_date, to_date, name, status, leader, purpouse, instructions, creation_date) 
      VALUES ("${fromDate}", "${toDate}", "Blokace", 5, ${userId}, "blokace", "", "${dayjs(
          new Date()
        ).format("YYYY-MM-DD")}")`,
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
  const guest = await checkUserSession();

  const reservation = (await query({
    query: `INSERT INTO reservations${guest ? "_mock" : ""
      } (from_date, to_date, purpouse, leader, instructions, name, status, creation_date)
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
      query: `SELECT first_name, last_name, email FROM users${guest ? "_mock" : ""
        } WHERE id = ?`,
      values: [leader],
    }),
    query({
      query: `SELECT display_name FROM status WHERE id = 2`,
    }),
    query({
      query: `SELECT email FROM users${guest ? "_mock" : ""
        } WHERE id IN(${members.map(() => "?")})`,
      values: [...members],
    }),
    query({
      query: `INSERT INTO reservations_rooms${guest ? "_mock" : ""
        } (reservationId, roomId, id) VALUES ${rooms.map(() => "(?,?,?)")}`,
      values: rooms.flatMap((room: any) => [
        reservation.insertId,
        room,
        [room, reservation.insertId].join(","),
      ]),
    }),
    members.length &&
    query({
      query: `INSERT INTO users_reservations${guest ? "_mock" : ""
        } (userId, reservationId, id) VALUES ${members
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
      query: `INSERT INTO reservations_groups${guest ? "_mock" : ""
        } (reservationId, groupId, id) VALUES ${groups
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
  const guest = await checkUserSession();

  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `DELETE FROM reservations${guest ? "_mock" : ""
        } WHERE id IN(${reservations.map(() => "?")})`,
      values: [...reservations],
    }),
    query({
      query: `DELETE FROM reservations_groups${guest ? "_mock" : ""
        } WHERE reservationId IN(${reservations.map(() => "?")})`,
      values: [...reservations],
    }),
    query({
      query: `DELETE FROM users_reservations${guest ? "_mock" : ""
        } WHERE reservationId IN(${reservations.map(() => "?")})`,
      values: [...reservations],
    }),
    query({
      query: `DELETE FROM reservations_rooms${guest ? "_mock" : ""
        } WHERE reservationId IN(${reservations.map(() => "?")})`,
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
  const guest = await checkUserSession();

  const [reservations, users, usersCount, groups, groupsCount] =
    (await Promise.all([
      query({
        query: `SELECT reservations.id, from_date, to_date, reservations.name, leader, instructions, purpouse, creation_date, 
    JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', display_name, 'icon', icon) as status,
    JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader,
    GROUP_CONCAT(
      JSON_OBJECT('id', rooms.id, 'people', rooms.people)
    ) as rooms
    FROM reservations${guest ? "_mock as reservations" : ""}
    INNER JOIN reservations_rooms${guest ? "_mock as reservations_rooms" : ""
          } ON reservations_rooms.reservationId = reservations.id
    INNER JOIN status ON reservations.status = status.id
    INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = reservations.leader
    INNER JOIN rooms ON roomId = rooms.id
    WHERE reservations.id = ?
    GROUP BY reservations.id
    `,
        values: [id],
      }),
      query({
        query: `SELECT users.id, first_name, last_name, image, email FROM users_reservations${guest ? "_mock" : ""
          } INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = userId WHERE reservationId = ? LIMIT 5 OFFSET ?`,
        values: [id, upage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM users_reservations${guest ? "_mock" : ""
          } WHERE reservationId = ?`,
        values: [id],
      }),
      query({
        query: `
        SELECT groups.id, groups.name, description, GROUP_CONCAT(DISTINCT userId) as users
        FROM reservations_groups${guest ? "_mock as reservations_groups" : ""}
        INNER JOIN groups${guest ? "_mock as groups" : ""
          } ON reservations_groups.groupId = groups.id
        LEFT JOIN users_groups${guest ? "_mock as users_groups" : ""
          } ON groups.id = users_groups.groupId
        WHERE reservationId = ?
        GROUP BY groups.id
        LIMIT 5 OFFSET ?
        `,
        values: [id, gpage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) as total FROM reservations_groups${guest ? "_mock as reservations_groups" : ""
          } WHERE reservationId = ?`,
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
  const guest = await checkUserSession();

  const { affectedRows } = (await query({
    query: `UPDATE reservations${guest ? "_mock" : ""
      } SET purpouse = ?, name = ?, instructions = ? WHERE id = ?`,
    values: [purpouse, name, instructions, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const reservationRemoveGroups = async ({
  reservation,
  groups,
}: {
  reservation: any;
  groups: any;
}) => {
  const guest = await checkUserSession();

  const { affectedRows } = (await query({
    query: `DELETE FROM reservations_groups${guest ? "_mock" : ""
      } WHERE reservationId = ? AND groupId IN(${groups.map(() => "?")})`,
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
  const guest = await checkUserSession();

  const [{ affectedRows }, { data }, usersEmails, reservationDetail] =
    (await Promise.all([
      query({
        query: `DELETE FROM users_reservations${guest ? "_mock" : ""
          } WHERE reservationId = ? AND userId IN(${users.map(() => "?")})`,
        values: [reservation, ...users],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT email FROM users${guest ? "_mock" : ""
          } WHERE id IN(${users.map(() => "?")})`,
        values: [...users],
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader 
      FROM reservations${guest ? "_mock as reservations" : ""
          } INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id = ?`,
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
  reason
}: {
  id: any;
  oldStatus: any;
  newStatus: any;
  reason?: any
}) => {
  let eventId = 10;
  switch (newStatus) {
    case 3:
      eventId = 10
      break;
    case 4:
      eventId = 11
      break;
  }
  const guest = await checkUserSession();

  const [reservation, { affectedRows }, { data }] = (await Promise.all([
    query({
      query: `SELECT reservations.from_date, reservations.status, reservations.name, reservations.to_date, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader,
      GROUP_CONCAT(distinct users.email) as emails FROM reservations${guest ? "_mock as reservations" : ""
        } LEFT JOIN users_reservations${guest ? "_mock as users_reservations" : ""
        } ON users_reservations.reservationId = reservations.id 
        INNER JOIN status ON status.id = reservations.status
        INNER JOIN users${guest ? "_mock as users" : ""
        } ON users_reservations.userId = users.id
        INNER JOIN users${guest ? "_mock" : " "
        } as leader ON leader.id = reservations.leader
       WHERE reservations.id = ? GROUP BY reservations.id`,
      values: [id],
    }),
    query({
      query: `UPDATE reservations${guest ? "_mock" : ""
        } SET status = ${newStatus} WHERE id = ${id}`,
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
      (eventId === 11 && reason && {
        name: "reason",
        value: reason
      })
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
  const guest = await checkUserSession();

  const [reservations, count] = (await Promise.all([
    query({
      query: `SELECT reservations.id, from_date, to_date, status, reservations.name, leader, 
      JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status,
      JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader,
      GROUP_CONCAT(
        DISTINCT JSON_OBJECT('id', rooms.id, 'people', rooms.people)
      ) as rooms
      FROM users_reservations${guest ? "_mock as users_reservations" : ""}
      INNER JOIN reservations${guest ? "_mock as reservations" : ""
        } ON users_reservations.reservationId = reservations.id 
      INNER JOIN status ON status.id = reservations.status
      INNER JOIN reservations_rooms${guest ? "_mock as reservations_rooms" : ""
        } ON reservations.id = reservations_rooms.reservationId
      INNER JOIN rooms ON reservations_rooms.roomId = rooms.id
      INNER JOIN users${guest ? "_mock as users" : ""
        } ON users.id = reservations.leader
      WHERE userId = ?
      GROUP BY reservations.id
      LIMIT 5 OFFSET ${page * 5 - 5}
      `,
      values: [userId],
    }),
    query({
      query: `SELECT COUNT(*) as total FROM users_reservations${guest ? "_mock" : ""
        } WHERE userId = ?`,
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
  const guest = await checkUserSession();
  const placeholders = newMembers.map(() => "(?,?,?)").join(", ");

  const [{ affectedRows }, groupDetail, owner, users, reservations, template] =
    (await Promise.all([
      query({
        query: `INSERT IGNORE INTO users_groups${guest ? "_mock" : ""
          } (userId, groupId, id) VALUES ${placeholders}`,
        values,
      }),
      query({
        query: `SELECT groups.* FROM groups${guest ? "_mock as groups" : ""
          } WHERE groups.id = ?`,
        values: [group],
      }),
      query({
        query: `SELECT first_name, last_name, email FROM users${guest ? "_mock as users" : ""
          } INNER JOIN groups${guest ? "_mock as groups" : ""
          } ON groups.owner = users.id WHERE groups.id = ?`,
        values: [group],
      }),
      query({
        query: `SELECT first_name, last_name, email FROM users${guest ? "_mock as users" : ""
          } WHERE id IN(${newMembers.map(() => "?")})`,
        values: [...newMembers],
      }),
      query({
        query: `SELECT reservations.* FROM reservations${guest ? "_mock as reservation" : ""
          } INNER JOIN reservations_groups${guest ? "_mock as reservations_groups" : ""
          } ON reservations.id = reservations_groups.reservationId`,
        values: [],
      }),
      mailEventDetail({ id: eventId }),
    ])) as any;

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
  const guest = await checkUserSession();

  const { affectedRows } = (await query({
    query: `INSERT IGNORE INTO reservations_groups${guest ? "_mock" : ""
      } (reservationId, groupId, id) VALUES ${placeholder}`,
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
  const guest = await checkUserSession();

  const { insertId, affectedRows } = (await query({
    query: `INSERT INTO groups${guest ? "_mock" : ""
      } (name, description, owner) VALUES (?,?,?)`,
    values: [name, description, owner],
  })) as any;

  await query({
    query: `INSERT IGNORE INTO users_groups${guest ? "_mock" : ""
      } (userId, groupId, id) VALUES ("${owner}", "${insertId}", ${JSON.stringify(
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
  const guest = await checkUserSession();

  const [group, reservations, resCount, users, usersCount] = (await Promise.all(
    [
      query({
        query: `SELECT groups.id, name, description, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image)
         as owner FROM groups${guest ? "_mock as groups" : ""
          } INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = groups.owner WHERE groups.id = ?`,
        values: [id],
      }),
      query({
        query: `SELECT reservations.id, from_date, to_date, name, status FROM reservations${guest ? "_mock as reservations" : ""
          } 
    INNER JOIN reservations_groups${guest ? "_mock as reservations_groups" : ""
          } ON reservations.id = reservations_groups.reservationId 
    WHERE reservations_groups.groupId = ? LIMIT 5 OFFSET ?`,
        values: [id, rpage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) AS total FROM reservations_groups${guest ? "_mock as reservations_groups" : ""
          } WHERE reservations_groups.groupId = ?`,
        values: [id],
      }),
      query({
        query: `SELECT users.id, first_name, last_name, email, image FROM users${guest ? "_mock as users" : ""
          } 
    INNER JOIN users_groups${guest ? "_mock as users_groups" : ""
          } ON users.id = users_groups.userId 
    WHERE users_groups.groupId = ? LIMIT 5 OFFSET ?`,
        values: [id, upage * 5 - 5],
      }),
      query({
        query: `SELECT COUNT(*) AS total FROM users_groups${guest ? "_mock as users_groups" : ""
          } WHERE users_groups.groupId = ?`,
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
  const guest = await checkUserSession();

  const { affectedRows } = (await query({
    query: `
      UPDATE groups${guest ? "_mock" : ""
      } SET name = ?, description = ? WHERE id = ?`,
    values: [name, description, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const getGroupList = async ({
  page,
  search,
  limit,
  rpp,
}: {
  page?: any;
  search?: any;
  limit?: any;
  rpp?: any;
}) => {
  const {
    user: { role, id },
  } = (await getServerSession(authOptions)) as any;
  const isLimited = role.id > 2;
  const guest = await checkUserSession();

  const [groups, reservations, users, count] = (await Promise.all([
    query({
      query: `
        SELECT groups.id, groups.name, description, 
        JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) AS owner, 
        GROUP_CONCAT(DISTINCT reservationId) AS reservations, GROUP_CONCAT(DISTINCT userId) AS users 
        FROM groups${guest ? "_mock as groups" : ""} 
        LEFT JOIN users${guest ? "_mock as users" : ""} ON users.id = owner 
        LEFT JOIN users_groups${guest ? "_mock as users_groups" : ""
        } ON users_groups.groupId = groups.id 
        LEFT JOIN reservations_groups${guest ? "_mock as reservations_groups" : ""
        } ON reservations_groups.groupId = groups.id 
        LEFT JOIN reservations${guest ? "_mock as reservations" : ""
        } ON reservations.id = reservations_groups.groupId
        WHERE 1=1
        ${search ? `AND groups.name LIKE "%${search}%"` : ""}
        ${limit && isLimited ? `AND groups.owner = ${id}` : ""}
        GROUP BY 
            groups.id
        ${page ? `LIMIT ${rpp} OFFSET ${page * rpp - rpp}` : ""}
      `,
      values: [],
    }),
    query({
      query: `SELECT id, from_date, to_date, name FROM reservations${guest ? "_mock" : ""
        }`,
      values: [],
    }),
    query({
      query: `SELECT first_name, last_name, email, id FROM users${guest ? "_mock" : ""
        }`,
      values: [],
    }),
    query({
      query: `
        SELECT COUNT(*) as total FROM groups${guest ? "_mock" : ""}
        WHERE 1=1
        ${search ? `AND groups.name LIKE "%${search}%"` : ""}
        ${limit && isLimited ? `AND groups.owner = ${id}` : ""}
      `,
      values: [],
    }),
  ])) as any;

  const data = groups.map((group: any) => {
    return {
      ...group,
      owner: JSON.parse(group.owner),
      reservations: group.reservations
        ? group.reservations
          .split(",")
          .map((res: any) =>
            reservations.find((r: any) => r.id === Number(res))
          )
        : [],
      users: group.users ? group.users.split(",").map(Number) : [],
    };
  });

  return { data, count: count[0].total };
};

export const removeGroups = async ({ groups }: { groups: any }) => {
  const eventId = 7;
  const guest = await checkUserSession();

  const [allGroups, { data }] = (await Promise.all([
    query({
      query: `SELECT groups.name, groups.description, JSON_OBJECT('first_name', owner.first_name, 'last_name', owner.last_name, 'email', owner.email) as owner, GROUP_CONCAT(users.email) as users 
      FROM groups${guest ? "_mock as groups" : ""}
      LEFT JOIN users_groups${guest ? "_mock as users_groups" : ""
        } ON users_groups.groupId = groups.id 
      INNER JOIN users${guest ? "_mock as users" : ""
        } ON users.id = users_groups.userId 
      INNER JOIN users${guest ? "_mock as owner" : " as owner"
        }  ON owner.id = groups.owner 
      WHERE groups.id IN(${groups.map(() => "?")}) 
      GROUP BY groups.id`,
      values: [...groups],
    }),
    mailEventDetail({ id: eventId }),
  ])) as any;

  const [{ affectedRows }] = (await Promise.all([
    query({
      query: `DELETE FROM groups${guest ? "_mock" : ""
        } WHERE id IN(${groups.map(() => "?")})`,
      values: [...groups],
    }),
    query({
      query: `DELETE FROM users_groups${guest ? "_mock" : ""
        } WHERE groupId IN(${groups.map(() => "?")})`,
      values: [...groups],
    }),
    query({
      query: `DELETE FROM reservations_groups${guest ? "_mock" : ""
        } WHERE groupId IN(${groups.map(() => "?")})`,
      values: [...groups],
    }),
  ])) as any;

  allGroups.map(async (grp: any) => {
    grp = { ...grp, owner: JSON.parse(grp.owner) };
    await sendEmail({
      send: data.active,
      to: grp.users.split(","),
      template: data.template,
      variables: [
        { name: "group_name", value: grp.name },
        {
          name: "owner_name",
          value: grp.owner.first_name + " " + grp.owner.last_name,
        },
        { name: "owner_email", value: grp.owner.email },
      ],
    });
  });

  return { success: affectedRows === groups.length };
};

export const groupRemoveUsers = async ({
  group,
  users,
}: {
  group: any;
  users: any;
}) => {
  const eventId = 6;
  const guest = await checkUserSession();

  const [
    groupDetail,
    groupUsers,
    owner,
    reservations,
    { affectedRows },
    template,
  ] = (await Promise.all([
    query({
      query: `SELECT * FROM groups${guest ? "_mock" : ""} WHERE id = ?`,
      values: [group],
    }),
    query({
      query: `SELECT first_name, last_name, email FROM users${guest ? "_mock" : ""
        } WHERE id IN(${users.map(() => "?")})`,
      values: [...users],
    }),
    query({
      query: `SELECT first_name, last_name, email FROM users${guest ? "_mock as users" : ""
        } INNER JOIN groups${guest ? "_mock as groups" : ""
        } ON groups.owner = users.id WHERE groups.id = ?`,
      values: [group],
    }),
    query({
      query: `SELECT * FROM reservations${guest ? "_mock as reservations" : ""
        } INNER JOIN reservations_groups${guest ? "_mock as reservations_groups" : ""
        } ON reservations.id = reservations_groups.groupId WHERE reservations_groups.groupId = ?`,
      values: [group],
    }),
    query({
      query: `DELETE FROM users_groups${guest ? "_mock" : ""
        } WHERE groupId = ? AND userId IN (${users.map(() => "?")})`,
      values: [group, ...users],
    }),
    mailEventDetail({ id: eventId }),
  ])) as any;

  const data = { ...groupDetail[0], owner: owner[0], groupUsers, reservations };

  await sendEmail({
    send: template.data.active,
    to: groupUsers.map(({ email }: { email: any }) => email),
    template: template.data.template,
    variables: [
      { name: "group_name", value: groupDetail[0].name },
      {
        name: "owner_name",
        value: owner[0].first_name + " " + owner[0].last_name,
      },
      { name: "owner_email", value: owner[0].email },
    ],
  });

  return { success: affectedRows === users.length };
};

export const groupRemoveReservations = async ({
  group,
  reservations,
}: {
  group: any;
  reservations: any;
}) => {
  const guest = await checkUserSession();

  const { affectedRows } = (await query({
    query: `DELETE FROM reservations_groups${guest ? "_mock" : ""
      } WHERE groupId = ? AND reservationId IN (${reservations.map(() => "?")})`,
    values: [group, ...reservations],
  })) as any;

  return { success: affectedRows === reservations.length };
};

export const userSpecifiedGroups = async ({
  id,
  page,
}: {
  id: any;
  page: any;
}) => {
  const guest = await checkUserSession();

  const [groups, count] = (await Promise.all([
    query({
      query: `SELECT groups.id, name, description, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) AS owner,
      (SELECT COUNT(*) FROM users_groups${guest ? "_mock" : ""
        } WHERE groupId = groups.id) AS userCount 
      FROM groups${guest ? "_mock as groups" : ""} INNER JOIN users_groups${guest ? "_mock as users_groups" : ""
        } ON groups.id = users_groups.groupId INNER JOIN users${guest ? "_mock as users" : ""
        } ON groups.owner = users.id 
      WHERE users_groups.userId = ? LIMIT 5 OFFSET ?`,
      values: [id, page * 5 - 5],
    }),
    query({
      query: `SELECT COUNT(*) as total FROM users_groups${guest ? "_mock as users_groups" : ""
        } WHERE users_groups.userId = ?`,
      values: [id],
    }),
  ])) as any;

  const data = groups.map((group: any) => {
    return {
      ...group,
      owner: JSON.parse(group.owner),
    };
  });

  return { data, count: count[0].total };
};

export const mailingTemplateEdit = async ({
  name,
  text,
  title,
  id,
}: {
  name: any;
  text: any;
  title: any;
  id: any;
}) => {
  const guest = await checkUserSession();

  const { affectedRows } = (await query({
    query: `
    UPDATE templates${guest ? "_mock" : ""
      } SET name = ?, title = ?, text = ? WHERE id = ?
  `,
    values: [name, title, text, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const malingTemplatesList = async () => {
  const guest = await checkUserSession();

  const templates = (await query({
    query: `
    SELECT * FROM templates${guest ? "_mock" : ""}
  `,
    values: [],
  })) as any;

  const data = templates.map((temp: any) => ({
    ...temp,
    text: temp.text,
  }));

  return data;
};

export const malingTemplateDetail = async ({ id }: { id: any }) => {
  const guest = await checkUserSession();

  const templates = (await query({
    query: `
        SELECT templates.id, templates.name, templates.title, templates.text, events_children.variables 
        FROM templates${guest ? "_mock as templates" : ""}
        INNER JOIN events_children${guest ? "_mock as events_children" : ""
      } ON events_children.template = templates.id
        WHERE templates.id = ?
  `,
    values: [id],
  })) as any;

  const data = {
    ...templates[0],
    variables: templates[0].variables.split(","),
  };

  return data;
};

export const mailingEventsEdit = async ({ data }: { data: any }) => {
  const guest = await checkUserSession();
  const array = Object.entries(data);
  const { affectedRows } = (await query({
    query: `
            INSERT INTO events_children${guest ? "_mock" : ""} (id, active)
            VALUES ${array.map(
      (item) => `(${item[0].split(" ")[1]}, ${item[1]})`
    )}
            ON DUPLICATE KEY UPDATE id=VALUES(id),
            active=VALUES(active)
    `,
    values: [],
  })) as any;

  return { succes: affectedRows === array.length };
};

export const mailingEventsList = async () => {
  const guest = await checkUserSession();

  const events = (await query({
    query: `
      SELECT events.id, events.name,
      GROUP_CONCAT(
        JSON_OBJECT('id', events_children.id, 'primary_txt', events_children.primary_txt,
        'secondary_txt', events_children.secondary_txt, 'variables', events_children.variables, 'template', 
        IF(templates.id IS NULL, NULL, JSON_OBJECT('id', templates.id, 'name', templates.name, 'title', templates.title, 'text', templates.text)),
        'active', events_children.active)
      ) as children
      FROM events INNER JOIN events_children${guest ? "_mock as events_children" : ""
      } ON events_children.event = events.id
      LEFT JOIN templates${guest ? "_mock as templates" : ""
      } ON templates.id = events_children.template
      GROUP BY events.id
  `,
    values: [],
  })) as any;

  const data = events.map((item: any) => {
    let children = Array.isArray(item.children)
      ? item.children
      : JSON.parse(`[${item.children}]`);
    return {
      ...item,
      children: children.map((child: any) => {
        let template =
          typeof child.template === "object"
            ? child.template
            : JSON.parse(`[${child.template}]`)[0];
        return {
          ...child,
          variables: child.variables.split(","),
          template: template,
        };
      }),
    };
  });
  return data;
};

export const userUploadPic = async ({
  picture,
  id,
}: {
  picture: any;
  id: any;
}) => {
  const { affectedRows } = (await query({
    query: `UPDATE users SET image = ? WHERE id = ?`,
    values: [picture, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const verifyUser = async ({
  ID_code,
  birth_date,
  newPassword,
  password,
  adress,
  id,
}: {
  ID_code: any;
  birth_date: any;
  newPassword: any;
  password: any;
  adress: any;
  id: any;
}) => {
  const guest = await checkUserSession();
  const eventId = 2;

  const data = (await query({
    query: `UPDATE users${guest ? "_mock" : ""
      } SET password = MD5("${newPassword}"), ID_code = "${ID_code}", verified = 1, birth_date = "${birth_date}", adress = "${adress}" WHERE id = ${id} AND password = MD5("${password}")`, // verified = 1!! pak přidat
    values: [],
  })) as any;

  if (data.affectedRows === 0) {
    return { success: false };
  }

  const [user, template] = (await Promise.all([
    query({
      query: `SELECT * FROM users${guest ? "_mock" : ""} WHERE id = ?`,
      values: [id],
    }),
    mailEventDetail({ id: eventId }),
  ])) as any;

  await sendEmail({
    send: template.data.active,
    to: user[0].email,
    template: template.data.template,
    variables: [{ name: "email", value: user[0].email }],
  });

  return { success: true, email: user[0].email };
};

export const setTheme = async (theme: any, id: any) => {
  const guest = await checkUserSession();
  const req = (await query({
    query: `UPDATE users${guest ? "_mock" : ""
      } SET theme = ${!theme} WHERE id = "${id}"`,
    values: [],
  })) as any;
};
