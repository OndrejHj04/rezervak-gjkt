import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SlidingMenu from "./SlidingMenu";

const menu = [
  { name: "Přehled", icon: "home", href: "/" },
  { name: "Počasí", icon: "wb_sunny", href: "/weather" },
  { name: "Uživatelé", icon: "person", href: "/user/list" },
  { name: "Skupiny", icon: "group", href: "/group/list" },
  { name: "Rezervace", icon: "calendar_month", href: "/reservation/list" },
  { name: "Aktivní přihlašování", icon: "assignment", href: "/registration/list" },
  { name: "Mailing", icon: "alternate_email", href: "/mailing/send" },
  { name: "Galerie", icon: "panorama", href: "/photogallery" },
]

export default async function SlidingMenuConfig() {
  const user = (await getServerSession(authOptions)) as any;

  if (!user) return null

  return <SlidingMenu menuConfig={menu} user={user} />;
}
