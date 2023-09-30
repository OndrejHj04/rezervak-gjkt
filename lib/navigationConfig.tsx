import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import PersonIcon from "@mui/icons-material/Person";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";

export const navConfig = [
  {
    path: "/",
    name: "Přehled",
    roles: [],
    icon: <DashboardIcon />,
  },
  {
    path: "/photogallery",
    name: "Fotogalerie",
    roles: [],
    icon: <PhotoCameraBackIcon />,
  },
  {
    path: "/admin",
    name: "Admin",
    roles: [1],
    icon: <AdminPanelSettingsIcon />,
  },
  {
    path: "/user/list",
    name: "Seznam uživatelů",
    roles: [1, 2],
    icon: <PersonIcon />,
  },
];
