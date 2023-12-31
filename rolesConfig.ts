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
      allReservations: {
        display: [1, 2],
      },
      pastReservations: {
        display: [1, 2],
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
  password: {
    name: "Zapomenuté heslo",
    path: "/password",
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
    roles: [1],
    menu: [true, false],
    icon: "shield_icon",
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
      },
      groupsTable: {
        name: "Všechny skupiny",
        path: "/group/list",
        roles: [1, 2, 3],
        config: {
          topbar: { search: [1, 2], export: [1, 2] },
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
        roles: [1],
        menu: [false, true],
        icon: "edit_calendar_icon",
      },
      reservationsTable: {
        name: "Všechny rezervace",
        path: "/reservation/list",
        roles: [1, 2, 3],
        config: {
          delete: [1, 2],
          topbar: { search: [1, 2], export: [1, 2], filter: [1, 2] },
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
