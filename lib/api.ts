"use server";

import { getServerSession } from "next-auth";
import { query } from "./db";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { transporter } from "./email";
import dayjs from "dayjs";
import { rolesConfig } from "./rolesConfig";
import { decode, sign } from "jsonwebtoken";
import { roomsEnum } from "@/app/constants/rooms";

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


            FROM users INNER JOIN roles ON roles.id = users.role
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
        SELECT reservations.id, from_date, to_date, reservations.name, purpouse, leader, status, creation_date, reject_reason, payment_symbol, success_link,
        JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', status.display_name, 'icon', status.icon) as status,
        JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader, 
        GROUP_CONCAT(
            DISTINCT groups.name
          ) as groups,
          JSON_OBJECT('active',
          CASE WHEN reservations_forms.form_id IS NULL THEN false
        ELSE true END
          ) as form,
        GROUP_CONCAT(DISTINCT userId) as users,
        GROUP_CONCAT(
          DISTINCT JSON_OBJECT('id', rooms.id, 'people', rooms.people)
        ) as rooms
        FROM reservations${guest ? "_mock as reservations" : ""}
        INNER JOIN status ON status.id = reservations.status
        LEFT JOIN reservations_forms ON reservations_forms.reservation_id = reservations.id
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
    form: JSON.parse(reservation.form),
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
  const { user } = await getServerSession(authOptions) as any
  const values = groups.map((group: any) => [
    reservation,
    group,
  ]);


  const [{ affectedRows }, { insertId }] = await Promise.all([
    query({
      query: `INSERT INTO reservations_groups (reservationId, groupId) VALUES ?`,
      values: [values],
    }),
    query({
      query: `INSERT INTO reservations_groups_change (user_id, reservation_id, direction) VALUES (?,?,1)`,
      values: [user.id, reservation]
    })
  ]) as any

  await query({
    query: `INSERT INTO reservations_groups_change_groups (group_id, change_id) VALUES ?`,
    values: [groups.map((group: any) => [group, insertId])]
  })

  return { success: affectedRows === groups.length }
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
  const { allowEmails } = await getEmailSettings()
  if (!allowEmails) return { success: false }

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
    query: `INSERT INTO emails (recipients, subject, content) VALUES (?,?,?)`,
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
  const guest = await checkUserSession();

  const values = groups.map((group: any) => [user, group])

  const [{ affectedRows }, userDetail, { data: template }, groupsData] =
    (await Promise.all([
      query({
        query: `INSERT INTO users_groups (userId, groupId) VALUES ?`,
        values: [values],
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
  const values = children.map((child: any) => [
    child,
    user
  ])

  const { affectedRows } = await query({
    query: `INSERT INTO children_accounts (childrenId, parentId) VALUES ?`,
    values: [values]
  }) as any

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
  const values = reservations.map((newReservation: any) => [
    user,
    newReservation,
  ]);

  const [{ affectedRows }, { data }, userDetail, reservationsDetail] =
    (await Promise.all([
      query({
        query: `INSERT INTO users_reservations (userId, reservationId) VALUES ?`,
        values: [values],
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
  ])) as any;

  return { success: affectedRows === users.length };
};

export const getUserTheme = async () => {
  const user = (await getServerSession(authOptions)) as any;
  if (!user) return { theme: 1 }

  const [{ theme }] = (await query({
    query: `SELECT theme FROM users WHERE id = ?`,
    values: [user.user.id],
  })) as any;

  return { theme };
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

export const userRemoveChildren = async ({
  user,
  children,
}: {
  user: any;
  children: any;
}) => {

  const { affectedRows } = await query({
    query: `DELETE FROM children_accounts WHERE parentId = ? AND childrenId IN(?)`,
    values: [user, children],
  }) as any

  return { success: affectedRows === children.length };
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
      query: `UPDATE users${guest ? "_mock" : ""} SET active = ? WHERE id = ? `,
      values: [!active, id],
    }),
    query({
      query: `SELECT email FROM users${guest ? "_mock" : ""} WHERE id = ? `,
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
      } WHERE email IN(${validData
        .map((item: any) => `"${item[2]}"`)
        .join(",")
      })`,
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
    query: `UPDATE users SET password = MD5(?) WHERE id = ? `,
    values: [password, id],
  })) as any;

  return { success: affectedRows === 1 };
};

export const sendResetPasswordEmail = async ({ email }: { email: any }) => {
  const eventId = 4;

  const users = (await query({
    query: `SELECT  id, email FROM users WHERE email = ? `,
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
          value: `${process.env.NEXT_PUBLIC_API_URL} / password - reset / form ? id = ${users[0].id} & token=${tkn}`,
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
  const { user } = await getServerSession(authOptions) as any

  const values = users.map((user: any) => [
    user,
    reservation,
  ]);

  const [{ affectedRows }, { data }, reservationDetail, usersEmails, change] =
    (await Promise.all([
      query({
        query: `INSERT INTO users_reservations (userId, reservationId) VALUES ?`,
        values: [values],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as owner 
      FROM reservations${guest ? "_mock as reservations" : ""
          } INNER JOIN users${guest ? "_mock as users" : ""
          } ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id = ? `,
        values: [reservation],
      }),
      query({
        query: `SELECT email FROM users${guest ? "_mock" : ""
          } WHERE id IN(${users.map(() => "?")})`,
        values: [...users],
      }),
      query({
        query: `INSERT INTO reservations_users_change (user_id, reservation_id, direction) VALUES (?,?,1)`,
        values: [user.id, reservation]
      })
    ])) as any;

  await query({
    query: `INSERT INTO reservations_users_change_users (user_id, change_id) VALUES ?`,
    values: [users.map((user: any) => [user, change.insertId])]
  })

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
}: {
  from_date: any;
  to_date: any;
}) => {
  const { user } = await getServerSession(authOptions) as any

  const blocation = await query({
    query: `INSERT INTO reservations (from_date, to_date, name, status, leader, purpouse, instructions) VALUES(?, ?, "Blokace", 5, ?, "blokace", "")`,
    values: [from_date, to_date, user.id],
  }) as any
  const [{ affectedRows: affectedRows }, _] = (await Promise.all([
    query({
      query: `UPDATE reservations SET status = 4 WHERE((from_date BETWEEN ? AND ?) OR(to_date BETWEEN ? AND ?)) AND status <>5 AND status <> 1`,
      values: [from_date, to_date, from_date, to_date],
    }),
    query({
      query: `INSERT INTO reservations_rooms (reservationId, roomId) VALUES ?`,
      values: [roomsEnum.list.map((room: any) => [blocation.insertId, room.id])]
    })
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
  const { user } = await getServerSession(authOptions) as any

  const reservation = await query({
    query: `INSERT INTO reservations (from_date, to_date, purpouse, leader, instructions, name, status) VALUES (?, ?, ?, ?, ?, ?, 2)`,
    values: [from_date, to_date, purpouse, leader, instructions, name],
  }) as any

  const change = await query({
    query: `INSERT INTO reservations_users_change (user_id, reservation_id, direction) VALUES (?,?,1)`,
    values: [user.id, reservation.insertId]
  }) as any

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
      query: `SELECT email FROM users WHERE id IN ?`,
      values: [[members]],
    }),
    query({
      query: `INSERT INTO reservations_rooms (reservationId, roomId) VALUES ?`,
      values: [rooms.map((room: any) => [
        reservation.insertId,
        room,
      ])],
    }),
    members.length &&
    query({
      query: `INSERT INTO users_reservations (userId, reservationId) VALUES ?`,
      values: [members.map((member: any) => [
        member,
        reservation.insertId,
      ])],
    }),
    groups.length &&
    query({
      query: `INSERT INTO reservations_groups (reservationId, groupId) VALUES ?`,
      values: [groups.map((group: any) => [
        reservation.insertId,
        group,
      ])],
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

  const { affectedRows } = await query({
    query: `DELETE FROM reservations WHERE id IN ?`,
    values: [[reservations]],
  }) as any

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
        query: `SELECT reservations.id, from_date, to_date, reservations.name, leader, instructions, purpouse, creation_date, success_link, payment_symbol, reject_reason, JSON_OBJECT('id', rf.form_id, 'publicUrl', rf.form_public_url) as form,
    JSON_OBJECT('id', status.id, 'name', status.name, 'color', status.color, 'display_name', display_name, 'icon', icon) as status,
    JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'email', users.email, 'image', users.image) as leader,
    GROUP_CONCAT(rooms.id separator ';') as rooms FROM reservations
    INNER JOIN reservations_rooms ON reservations_rooms.reservationId = reservations.id
    INNER JOIN status ON reservations.status = status.id
    INNER JOIN reservations_forms rf ON rf.reservation_id = reservations.id
    INNER JOIN users ON users.id = reservations.leader
    INNER JOIN rooms ON roomId = rooms.id
    WHERE reservations.id = ?
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
    form: JSON.parse(reservations[0].form),
    rooms: reservations[0].rooms ? reservations[0].rooms.split(';').map(Number) : [],
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
  from_date,
  to_date,
  dirtyFields,
  success_link,
  payment_symbol
}: {
  id: any;
  purpouse: any;
  instructions: any;
  name: any;
  from_date: any
  to_date: any
  dirtyFields: any
  success_link: any,
  payment_symbol: any
}) => {
  const { user } = await getServerSession(authOptions) as any
  const requests = []

  if (dirtyFields.from_date || dirtyFields.to_date) {
    requests.push(
      query({
        query: `INSERT INTO reservation_status_change (reservation_id, user_id, before_status, after_status) SELECT ?,?, reservations.status, 2 FROM reservations WHERE id = ?`,
        values: [id, user.id, id]
      }),
      query({
        query: `INSERT INTO reservations_date_change (user_id, reservation_id, before_from_date, after_from_date, before_to_date, after_to_date) SELECT ?,?,reservations.from_date,?,reservations.to_date,? FROM reservations WHERE id = ?`,
        values: [user.id, id, from_date, to_date, id]
      }), query({
        query: `UPDATE reservations SET status = 2 WHERE id = ?`,
        values: [id]
      }),
    )
  }

  if (dirtyFields.name || dirtyFields.purpouse || dirtyFields.instructions || dirtyFields.success_link || dirtyFields.payment_symbol) {
    requests.push(
      query({
        query: `INSERT INTO reservations_description_change (user_id, reservation_id, before_name, after_name, before_purpouse, after_purpouse, before_instructions, after_instructions, before_success_link, after_success_link, before_payment_symbol, after_payment_symbol) SELECT ?,?,reservations.name,?,reservations.purpouse,?,reservations.instructions,?,reservations.success_link,?,reservations.payment_symbol,? FROM reservations WHERE id = ?`,
        values: [user.id, id, name, purpouse, instructions, success_link, payment_symbol, id]
      })
    )
  }

  const req = await Promise.all(requests) as any

  await query({
    query: `UPDATE reservations SET purpouse = ?, name = ?, instructions = ?, from_date = ?, to_date = ?, success_link = ?, payment_symbol = ? WHERE id = ?`,
    values: [purpouse, name, instructions, from_date, to_date, success_link, payment_symbol, id],
  })

  return { success: req[req.length - 1].affectedRows === 1 };
};

export const reservationRemoveGroups = async ({
  reservation,
  groups,
}: {
  reservation: any;
  groups: any;
}) => {

  const { user } = await getServerSession(authOptions) as any

  const [{ affectedRows }, { insertId }] = await Promise.all([
    query({
      query: `DELETE FROM reservations_groups WHERE reservationId = ? AND groupId IN ?`,
      values: [reservation, [groups]],
    }),
    query({
      query: `INSERT INTO reservations_groups_change (user_id, reservation_id, direction) VALUES (?,?,0)`,
      values: [user.id, reservation]
    })
  ]) as any

  await query({
    query: `INSERT INTO reservations_groups_change_groups (group_id, change_id) VALUES ?`,
    values: [groups.map((group: any) => [group, insertId])]
  })

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
  const { user } = await getServerSession(authOptions) as any

  const [{ affectedRows }, { data }, usersEmails, reservationDetail, change] =
    (await Promise.all([
      query({
        query: `DELETE FROM users_reservations WHERE reservationId = ? AND userId IN ?`,
        values: [reservation, [users]],
      }),
      mailEventDetail({ id: eventId }),
      query({
        query: `SELECT email FROM users WHERE id IN ?`,
        values: [[users]],
      }),
      query({
        query: `SELECT reservations.from_date, reservations.to_date, status.display_name, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader 
      FROM reservations INNER JOIN users ON users.id = reservations.leader INNER JOIN status ON status.id = reservations.status WHERE reservations.id = ?`,
        values: [reservation],
      }),
      query({
        query: `INSERT INTO reservations_users_change (user_id, reservation_id, direction) VALUES (?, ?, false)`,
        values: [user.id, reservation]
      }),
    ])) as any;

  await query({
    query: `INSERT INTO reservations_users_change_users (user_id, change_id) VALUES ?`,
    values: [users.map((user: any) => [user, change.insertId])]
  })

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
  rejectReason = null,
  paymentSymbol = null,
  successLink = null,
}: {
  id: any;
  oldStatus: any;
  newStatus: any;
  rejectReason?: any
  paymentSymbol?: any,
  successLink?: any,
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
  const { user } = await getServerSession(authOptions) as any

  const [reservation, { data }, _] = (await Promise.all([
    query({
      query: `SELECT reservations.from_date, reservations.status, reservations.name, reservations.to_date, JSON_OBJECT('first_name', users.first_name, 'last_name', users.last_name, 'email', users.email) as leader, reservations.payment_symbol, reservations.success_link,
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
    mailEventDetail({ id: eventId }),
    query({
      query: `INSERT INTO reservation_status_change (user_id, reservation_id, before_status, after_status, reject_reason) VALUES (?,?,?,?,?)`,
      values: [user.id, id, oldStatus, newStatus, rejectReason]
    })
  ])) as any;

  if (reservation[0].success_link !== successLink || reservation[0].payment_symbol !== paymentSymbol) {
    await query({
      query: `INSERT INTO reservations_description_change (user_id, reservation_id, before_name, after_name, before_purpouse, after_purpouse, before_instructions, after_instructions, before_success_link, after_success_link, before_payment_symbol, after_payment_symbol) SELECT ?,?,reservations.name,reservations.name,reservations.purpouse,reservations.purpouse,reservations.instructions,reservations.instructions,reservations.success_link,?,reservations.payment_symbol,? FROM reservations WHERE id = ?        
      `,
      values: [user.id, id, successLink, paymentSymbol, id]
    })
  }

  const formatRejectReason = (newStatus === 2 || newStatus === 3 || newStatus === 1) ? null : rejectReason

  const [statuses, { affectedRows }] = (await Promise.all([
    query({
      query: `
      SELECT status.display_name FROM status WHERE id = ?
      UNION ALL
      SELECT status.display_name FROM status WHERE id = ?
    `,
      values: [oldStatus, newStatus],
    }),
    query({
      query: `UPDATE reservations SET status = ?, reject_reason = ?, payment_symbol = ?, success_link = ? WHERE id = ?`,
      values: [newStatus, formatRejectReason, paymentSymbol, successLink, id],
    }),
  ])) as any

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
      }
    ],
  });

  return { success: affectedRows === 1, rejectReason: formatRejectReason };
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

export const groupAddUsers = async ({
  group,
  users,
}: {
  group: any;
  users: any;
}) => {
  const eventId = 5;
  const values = users.map((user: any) => [
    user,
    group,
  ]);

  const [{ affectedRows }, groupDetail, owner, usersDetail, reservations, template] =
    (await Promise.all([
      query({
        query: `INSERT INTO users_groups (userId, groupId) VALUES ?`,
        values: [values],
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
        query: `SELECT first_name, last_name, email FROM users WHERE id IN ?`,
        values: [[users]],
      }),
      query({
        query: `SELECT reservations.* FROM reservations INNER JOIN reservations_groups ON reservations.id = reservations_groups.reservationId`,
        values: [],
      }),
      mailEventDetail({ id: eventId }),
    ])) as any;

  await sendEmail({
    send: template.data.active,
    to: usersDetail.map(({ email }: { email: any }) => email),
    template: template.data.template,
    variables: [
      { name: "group_name", value: groupDetail[0].name },
      { name: "users_count", value: usersDetail.length },
      {
        name: "owner_name",
        value: owner[0].first_name + " " + owner[0].last_name,
      },
      { name: "owner_email", value: owner[0].email },
    ],
  });

  return { success: affectedRows === users.length };
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
    query: `INSERT INTO users_groups (userId, groupId) VALUES ("${owner}", "${insertId}")`,
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
      query: `SELECT * FROM groups WHERE id = ?`,
      values: [group],
    }),
    query({
      query: `SELECT first_name, last_name, email FROM users WHERE id IN ?`,
      values: [[users]],
    }),
    query({
      query: `SELECT first_name, last_name, email FROM users INNER JOIN groups ON groups.owner = users.id WHERE groups.id = ?`,
      values: [group],
    }),
    query({
      query: `SELECT * FROM reservations INNER JOIN reservations_groups ON reservations.id = reservations_groups.groupId WHERE reservations_groups.groupId = ?`,
      values: [group],
    }),
    query({
      query: `DELETE FROM users_groups WHERE groupId = ? AND userId IN ?`,
      values: [group, [users]]
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

  const { affectedRows } = (await query({
    query: `DELETE FROM reservations_groups WHERE groupId = ? AND reservationId IN ?`,
    values: [group, [reservations]],
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
            active=VALUES(active), primary_txt = primary_txt, secondary_txt = secondary_txt, template = template, event = event, variables = variables`,
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
  const req = (await query({
    query: `UPDATE users SET theme = ? WHERE id = ?`,
    values: [!theme, id],
  })) as any;
};

export const getSendMails = async ({ page = 1, rpp = 10 }: any) => {
  const [data, count] = await Promise.all([query({
    query: `SELECT emails.id, emails.recipients, emails.subject, emails.content, emails.date FROM emails ORDER BY emails.date DESC
    ${page ? `LIMIT ${rpp} OFFSET ${page * rpp - rpp}` : ""}`,
    values: []
  }), query({
    query: `SELECT COUNT(*) as count FROM emails`,
    values: []
  })]) as any

  return { data, count: count[0].count }
}


export const getSendMailDetail = async (id: any) => {
  const data = await query({
    query: `SELECT emails.id, emails.recipients, emails.subject, emails.content, emails.date FROM emails WHERE emails.id = ?`,
    values: [id]
  }) as any
  return { data: data[0] }
}

export const getReservationTimeline = async (id: any) => {
  const [reservationCoreDates, reservationDateChanges, reservationDescChanges, reservationUserChanges, reservationGroupChange, reservationStatusChange, reservationRoomsChange, reservationSigninChange] = await Promise.all([
    query({
      query: 'SELECT reservations.creation_date, reservations.from_date, reservations.to_date, reservations.to_date as archivation FROM reservations WHERE id = ?',
      values: [id]
    }),
    query({
      query: `SELECT rdc.timestamp, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'image', users.image) as author,
      JSON_OBJECT('before_from_date',before_from_date,'before_to_date',before_to_date) as before_change,
      JSON_OBJECT('after_from_date', after_from_date, 'after_to_date', after_to_date) as after_change 
      FROM reservations_date_change as rdc 
      INNER JOIN users ON users.id = rdc.user_id
      WHERE reservation_id = ?`,
      values: [id]
    }),
    query({
      query: `SELECT rdc.timestamp, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'image', users.image) as author, JSON_OBJECT('name', rdc.before_name, 'purpouse', rdc.before_purpouse, 'instructions', rdc.before_instructions, 'success_link', rdc.before_success_link, 'payment_symbol', rdc.before_payment_symbol) as before_change, 
      JSON_OBJECT('name', rdc.after_name, 'purpouse', rdc.after_purpouse, 'instructions', rdc.after_instructions, 'success_link', rdc.after_success_link, 'payment_symbol', rdc.after_payment_symbol) as after_change 
      FROM reservations_description_change as rdc
      INNER JOIN users ON users.id = rdc.user_id
      WHERE reservation_id = ?`,
      values: [id]
    }),
    query({
      query: `SELECT ruc.timestamp, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'image', users.image) as author, ruc.direction, GROUP_CONCAT(JSON_OBJECT('id', u.id, 'first_name', u.first_name, 'last_name', u.last_name, 'image', u.image) separator ';') as users
      FROM reservations_users_change as ruc
      INNER JOIN users ON users.id = ruc.user_id
      INNER JOIN reservations_users_change_users rucu ON rucu.change_id = ruc.id  
      INNER JOIN users u ON u.id = rucu.user_id 
      WHERE reservation_id = ?
      GROUP BY timestamp`,
      values: [id]
    }),
    query({
      query: `SELECT rgc.timestamp, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'image', users.image) as author, rgc.direction, GROUP_CONCAT(JSON_OBJECT('id', g.id, 'name', g.name, 'owner', JSON_OBJECT('id', u.id, 'first_name', u.first_name, 'last_name', u.last_name)) separator ';') as groups
      FROM reservations_groups_change as rgc
      INNER JOIN users ON users.id = rgc.user_id
      INNER JOIN reservations_groups_change_groups rugu ON rugu.change_id = rgc.id  
      INNER JOIN groups g ON g.id = rugu.group_id 
      INNER JOIN users u ON u.id = g.owner
      WHERE reservation_id = ?
      GROUP BY timestamp
      `,
      values: [id]
    }),
    query({
      query: `SELECT rsc.timestamp, rsc.reject_reason, JSON_OBJECT('id', users.id, 'first_name', users.first_name, 'last_name', users.last_name, 'image', users.image) as author, rsc.before_status, JSON_OBJECT('id', rsb.id, 'display_name', rsb.display_name, 'color', rsb.color, 'icon', rsb.icon) as before_status, JSON_OBJECT('id', rsa.id, 'display_name', rsa.display_name, 'color', rsa.color, 'icon', rsa.icon) as after_status FROM reservation_status_change as rsc
      INNER JOIN users ON users.id = rsc.user_id
      INNER JOIN status as rsb ON rsb.id = rsc.before_status 
      INNER JOIN status as rsa ON rsa.id = rsc.after_status 
      WHERE reservation_id = ?
      GROUP BY timestamp
      `,
      values: [id]
    }),
    query({
      query: `SELECT * FROM reservations_rooms_change rr WHERE reservation_id = ?`,
      values: [id]
    }),
    query({
      query: `SELECT rf.form_id, rf.form_public_url as formPublicUrl, rf.timestamp FROM reservations_forms as rf WHERE reservation_id = ?`,
      values: [id]
    })
  ]) as any

  const formatedData = [...Object.values(reservationCoreDates[0]).map(((event: any, i: any) => ({
    timestamp: event,
    timelineEventTypeId: i,
    ...((i === 1 || i === 2) && { dateFormat: "DD. MM." })
  }))), ...reservationDateChanges.map((item: any) => ({
    author: JSON.parse(item.author),
    before: JSON.parse(item.before_change),
    after: JSON.parse(item.after_change),
    timestamp: item.timestamp,
    timelineEventTypeId: 40
  })), ...reservationDescChanges.map((item: any) => ({
    author: JSON.parse(item.author),
    before: JSON.parse(item.before_change),
    after: JSON.parse(item.after_change),
    difference: Object.keys(JSON.parse(item.before_change)).filter(k => JSON.parse(item.before_change)[k] !== JSON.parse(item.after_change)[k]),
    timestamp: item.timestamp,
    timelineEventTypeId: 30
  })), ...reservationUserChanges.map((item: any) => ({
    ...item,
    author: JSON.parse(item.author),
    users: item.users.split(";").map((item: any) => JSON.parse(item)),
    timelineEventTypeId: item.direction ? 11 : 10
  })), ...reservationGroupChange.map((item: any) => ({
    ...item,
    author: JSON.parse(item.author),
    groups: item.groups.split(";").map((item: any) => JSON.parse(item)),
    timelineEventTypeId: item.direction ? 21 : 20
  })), ...reservationStatusChange.map((item: any) => ({
    ...item,
    author: JSON.parse(item.author),
    before_status: JSON.parse(item.before_status),
    after_status: JSON.parse(item.after_status),
    timelineEventTypeId: Number(`5${JSON.parse(item.after_status).id}`)
  })), ...reservationRoomsChange.map((item: any) => ({
    ...item,
    rooms: item.rooms.split(";"),
    timelineEventTypeId: 60
  })), ...reservationSigninChange.map((item: any) => ({
    ...item,
    timelineEventTypeId: 70
  }))].sort((a, b) => {
    const timeDiff = a.timestamp - b.timestamp
    if (timeDiff !== 0) return timeDiff
    return a.timelineEventyTypeId - b.timelineEventyTypeId
  })

  return { data: formatedData, count: formatedData.length }
}

export const reservationSaveRooms = async ({ reservation, rooms }: { reservation: any, rooms: any }) => {
  const [_, { affectedRows }] = await Promise.all([
    query({
      query: `DELETE FROM reservations_rooms WHERE reservationId = ?`,
      values: [reservation]
    }),
    query({
      query: `INSERT INTO reservations_rooms (reservationId, roomId) VALUES ?`,
      values: [rooms.map((room: any) => [reservation, room])]
    }),
    query({
      query: `INSERT INTO reservations_rooms_change (reservation_id, rooms) VALUES (?,?)`,
      values: [reservation, rooms.toString()]
    })
  ]) as any

  return { success: affectedRows === rooms.length }
}

export const toggleEmailSettings = async (switchValue: boolean) => {
  const { affectedRows } = await query({
    query: `UPDATE settings SET allow_mail_sending = ?`,
    values: [switchValue]
  }) as any

  return { success: affectedRows === 1 }
}

export const getEmailSettings = async () => {
  const req = await query({
    query: `SELECT allow_mail_sending FROM settings`,
  }) as any

  return { allowEmails: req[0].allow_mail_sending }
}


export const allowReservationSignIn = async ({ reservation }: { reservation: any }) => {
  const reqBody = { name: reservation.name, from_date: dayjs(reservation.from_date).format("DD. MM. YYYY"), to_date: dayjs(reservation.to_date).format("DD. MM. YYYY"), instructions: reservation.instructions, leader: { first_name: reservation.leader.first_name, last_name: reservation.leader.last_name } }

  const req = await fetch(process.env.GOOGLE_FORM_API as any, { method: "POST", body: JSON.stringify({ data: reqBody, action: "create" }) })

  const { success, formId, formPublicUrl } = await req.json()

  const saveForm = await query({
    query: `INSERT INTO reservations_forms (form_id, form_public_url, reservation_id) VALUES (?,?,?)`,
    values: [formId, formPublicUrl, reservation.id]
  })

  return { success: true }
}

export const stopSignin = async ({ formId }: { formId: any }) => {

  const [, { affectedRows }] = await Promise.all([
    fetch(process.env.GOOGLE_FORM_API as any, { method: "POST", body: JSON.stringify({ data: { formId }, action: "clear" }) }),
    query({
      query: `DELETE FROM reservations_forms WHERE form_id = ?`,
      values: [formId]
    })
  ]) as any

  return { success: affectedRows === 1 }
} 
