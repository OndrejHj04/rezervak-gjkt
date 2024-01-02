export const rolesConfig = {
  users: {
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
  groups: {
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
  reservations: {
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
};
