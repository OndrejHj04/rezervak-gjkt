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
    name: "Všichni uživatelé",
    roles: [1, 2, 3],
  },
  {
    path: "/group/list",
    name: "Skupiny",
    roles: [1, 2, 3],
  },
  {
    path: "/reservations/list",
    name: "Rezervace",
    roles: [1, 2, 3],
  },
];
