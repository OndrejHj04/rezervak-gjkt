export const rolesConfig = {
  users: {
    table: {
      delete: [1, 2],
      topbar: { filter: [1, 2], search: [1, 2], export: [1, 2] },
      detail: [1, 2],
    },
  },
  groups: {
    table: {
      delete: [1, 2],
      topbar: { search: [1, 2], export: [1, 2] },
    },
  },
  reservations: {
    table: {
      delete: [1, 2],
      topbar: { search: [1, 2], export: [1, 2], filter: [1, 2] },
      detail: [1, 2],
    },
  },
};
