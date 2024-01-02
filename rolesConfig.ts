export const rolesConfig = {
  homepage: { name: "Přehled", path: "/", modules: [], roles: [] },
  photogallery: {
    name: "Galerie",
    path: "/photogallery",
    modules: [],
    roles: [],
  },
  admin: { name: "Administrace", path: "/admin", modules: [], roles: [1] },
  users: {
    name: "Uživatelé",
    path: "/user/list",
    route: "/users",
    modules: {
      table: {
        delete: [1, 2],
        topbar: { filter: [1, 2], search: [1, 2], export: [1, 2] },
      },
      detail: {
        visit: [1, 2],
        visitSelf: [1, 2, 3, 4],
        edit: [1],
        selfEdit: [1, 2, 3, 4],
      },
    },
    roles: [1, 2, 3],
  },
  groups: {
    name: "Skupiny",
    path: "/group/list",
    route: "/groups",
    modules: {
      table: {
        delete: [1, 2],
        topbar: { search: [1, 2], export: [1, 2] },
      },
      detail: {
        visit: [1, 2],
        visitSelf: [1, 2, 3, 4],
        edit: [1],
      },
    },
    roles: [1, 2, 3],
  },
  reservations: {
    name: "Rezervace",
    path: "/reservations/list",
    route: "/reservations",
    modules: {
      table: {
        delete: [1, 2],
        topbar: { search: [1, 2], export: [1, 2], filter: [1, 2] },
      },
      detail: {
        visit: [1, 2],
        visitSelf: [1, 2, 3, 4],
        edit: [1],
      },
    },
    roles: [1, 2, 3],
  },
};
