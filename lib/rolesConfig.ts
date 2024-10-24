export const rolesConfig = {
  homepage: {
    name: "Přehled",
    path: "/",
    modules: {
      personalGroups: {
        display: [1, 2, 3, 4],
      },
      personalReservations: {
        display: [1, 2, 3, 4],
      },
      weatherWidget: {
        display: [1, 2, 3, 4],
      },
      allReservations: {
        display: [1, 2],
      },
      pastReservations: {
        display: [1, 2],
      },
      blockDates: {
        display: [1],
      },
    },
    roles: [],
    menu: [true, false],
    icon: "home",
  },
  login: {
    name: "Přihlášení",
    path: "/login",
    modules: [],
    roles: [],
    menu: [false, false],
  },
  passwordEmail: {
    name: "Obnovit heslo",
    path: "/password-reset/email",
    modules: [],
    roles: [],
    menu: [false, false],
  },
  passwordForm: {
    name: "Obnovit heslo",
    path: "/password-reset/form",
    modules: [],
    roles: [],
    menu: [false, false],
  },
  photogallery: {
    name: "Galerie",
    path: "/photogallery",
    modules: {},
    roles: [],
    menu: [true, false],
    icon: "panorama_icon",
  },
  admin: {
    name: "Administrace",
    path: "/admin",
    modules: {},
    roles: [0],
    menu: [false, false],
    icon: "shield_icon",
  },
  weather: {
    name: "Počasí",
    path: "/weather",
    modules: {},
    roles: [],
    menu: [true, false],
    icon: "wb_sunny_icon",
  },
  users: {
    name: "Uživatelé",
    path: "/user",
    modules: {
      userCreate: {
        name: "Vytvořit uživatele",
        path: "/user/create",
        roles: [1, 2, 3],
        menu: [false, true],
        icon: "person_add_icon",
        options: {
          1: [1, 2, 3, 4],
          2: [3, 4],
          3: [4],
          4: [],
        },
      },
      usersImport: {
        name: "Importovat uživatele",
        path: "/user/import",
        roles: [1, 2],
        menu: [false, true],
        icon: "import_export_icon",
      },
      userTable: {
        name: "Všichni uživatelé",
        path: "/user/list",
        roles: [1, 2, 3],
        config: {
          delete: [1, 2],
          topbar: { filter: [1, 2], search: [1, 2], export: [1, 2] },
        },
        menu: [true, false],
        icon: "person_search_icon",
        columns: {
          1: [
            "name",
            "email",
            "role",
            "birth_date",
            "verified",
            "organization",
          ],
          2: [
            "name",
            "email",
            "role",
            "birth_date",
            "verified",
            "organization",
          ],
          3: ["name", "email", "role"],
          4: [],
        },
      },
      userDetail: {
        path: "/user/detail",
        visit: [1, 2],
        visitSelf: [1, 2, 3, 4],
        edit: [1],
        selfEdit: [1, 2, 3],
      },
    },
  },
  groups: {
    name: "Skupiny",
    path: "/group",
    modules: {
      groupsCreate: {
        name: "Vytvořit skupinu",
        path: "/group/create",
        roles: [1, 2, 3],
        menu: [false, true],
        icon: "group_add_icon",
        select: {
          1: true,
          2: false,
          3: false,
          4: false,
        },
      },
      groupsTable: {
        name: "Všechny skupiny",
        path: "/group/list",
        roles: [1, 2, 3],
        config: {
          topbar: { search: [1, 2], export: [1, 2], delete: [1, 2] },
        },
        menu: [true, false],
        icon: "group",
      },
      groupsDetail: {
        path: "/group/detail",
        visit: [1, 2],
        visitSelf: [1, 2, 3, 4],
        edit: [1],
      },
    },
    roles: [1, 2, 3],
  },
  reservations: {
    name: "Rezervace",
    path: "/reservation",
    modules: {
      reservationsCreate: {
        name: "Vytvořit rezervaci",
        path: "/reservation/create",
        roles: [1, 2, 3],
        menu: [false, true],
        icon: "edit_calendar_icon",
      },
      reservaionsForms: {
        name: "Přihlašování na rezervace",
        path: "/reservation/forms",
        roles: [1, 2, 3],
        menu: [false, false],
      },
      reservationsTable: {
        name: "Všechny rezervace",
        path: "/reservation/list",
        roles: [1, 2, 3],
        config: {
          delete: [1, 2],
          topbar: { search: [1, 2], export: [1, 2], filter: [1, 2] },
          changeStatus: [1, 2],
        },
        menu: [true, false],
        icon: "calendar_month_icon",
      },
      reservationsDetail: {
        path: "/reservation/detail",
        visit: [1, 2],
        visitSelf: [1, 2, 3, 4],
        edit: [1],
      },
    },
  },
  emails: {
    name: "Maily",
    path: "/mailing",
    modules: {
      send: {
        name: "Mailing",
        path: "/mailing/send",
        roles: [1, 2],
        menu: [true, false],
        icon: "feed_icon",
      },
      templates: {
        name: "Templates",
        path: "/mailing/templates",
        roles: [1, 2],
        menu: [false, false],
      },
      events: {
        name: "Events",
        path: "/mailing/events",
        roles: [1, 2],
        menu: [false, false]
      }
    },
  },
  sampleFile: {
    name: "Vzorový soubor",
    path: "/vzorovy_soubor.csv",
    roles: [1, 2],
    menu: [false, false],
  },
  approvalFile: {
    name: "Podmínky",
    path: "/podminky.pdf",
    roles: [],
    menu: [false, false],
  },
  changelog: {
    name: "Changelog",
    path: "/changelog",
    roles: [],
    menu: [false, false],
  },
};

export const getRoutes = (config: any, role: any, result: any = []) => {
  config.forEach((item: any) => {
    if (!role) {
      item.roles && !item.roles.length && result.push(item);
    } else {
      if (item.menu && (!item.roles.length || item.roles.includes(role.id))) {
        result.push(item);
      } else if (item.modules) {
        getRoutes(Object.values(item.modules), role, result);
      }
    }
  });

  return result;
};
