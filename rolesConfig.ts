export const rolesConfig = {
  homepage: {
    name: "Přehled",
    path: "/",
    modules: [],
    roles: [],
    menu: [true, false],
  },
  login: {
    name: "Přihlášení",
    path: "/login",
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
  },
  admin: {
    name: "Administrace",
    path: "/admin",
    modules: {},
    roles: [1],
    menu: [true, false],
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
      },
      usersImport: {
        name: "Importovat uživatele",
        path: "/user/import",
        roles: [1, 2],
        menu: [false, true],
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
      },
      userDetail: {
        visit: [1, 2],
        visitSelf: [1, 2, 3, 4],
        edit: [1],
        selfEdit: [1, 2, 3, 4],
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
      },
      groupsTable: {
        name: "Všechny skupiny",
        path: "/group/list",
        roles: [1, 2, 3],
        config: {
          delete: [1, 2],
          topbar: { search: [1, 2], export: [1, 2] },
        },
        menu: [true, false],
      },
      groupsDetail: {
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
        path: "/reservations/create",
        roles: [1],
        menu: [false, true],
      },
      reservationsTable: {
        name: "Všechny rezervace",
        path: "/reservations/list",
        roles: [1, 2, 3],
        config: {
          delete: [1, 2],
          topbar: { search: [1, 2], export: [1, 2], filter: [1, 2] },
        },
        menu: [true, false],
      },
      reservationsDetail: {
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
