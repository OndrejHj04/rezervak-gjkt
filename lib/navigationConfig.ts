export const navConfig = [
  {
    path: "/",
    name: "Přehled",
    roles: [],
  },
  {
    path: "/photogallery",
    name: "Fotogalerie",
    roles: [],
  },
  {
    path: "/admin",
    name: "Admin",
    roles: [1],
  },
  {
    path: "/user/list",
    name: "Seznam uživatelů",
    roles: [1, 2],
  },
];
