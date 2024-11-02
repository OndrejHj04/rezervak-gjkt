const sideMenu = [
  { name: "Přehled", icon: "home", href: ["/"], roles: [1, 2, 3] },
  { name: "Uživatelé", icon: "person", href: ["/user/list"], roles: [1, 2, 3] },
  { name: "Skupiny", icon: "group", href: ["/group/list"], roles: [1, 2, 3] },
  { name: "Rezervace", icon: "calendar_month", href: ["/reservation/list"], roles: [1, 2, 3] },
  { name: "Aktivní přihlašování", icon: "assignment", href: ["/registration/list"], roles: [1, 2] },
  { name: "Archiv", icon: "bookmark", href: ["/archive/list"], roles: [1, 2] },
  { name: "Mailing", icon: "alternate_email", href: ["/mailing/send", "/mailing/templates", "/mailing/events"], roles: [1, 2] },
  { name: "Galerie", icon: "panorama", href: ["/photogallery"], roles: [1, 2, 3] },
  { name: "Počasí", icon: "wb_sunny", href: ["/weather"], roles: [1, 2, 3] },
];

const actionMenu = [
  { href: "/reservation/create", name: "Vytvořit rezervaci", icon: "edit_calendar" },
  { href: "/group/create", name: "Vytvořit skupinu", icon: "group_add" },
  { href: "/user/import", name: "Importovat uživatele", icon: "import_export" },
  { href: "/user/create", name: "Vytvořit uživatele", icon: "person_add" },
  { href: "/user/family", name: "Přidat rodinný účet", icon: "child_friendly" },
]

const otherRoutes = ['/changelog', '/password-reset', '/vzorovy_soubor.csv', '/podminky.pdf']

export { sideMenu, actionMenu, otherRoutes }
