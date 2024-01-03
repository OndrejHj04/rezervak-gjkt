import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SlidingMenu from "./SlidingMenu";
import { getRoutes, rolesConfig } from "@/rolesConfig";

export default async function SlidingMenuConfig() {
  const data = (await getServerSession(authOptions)) as any;

  const menuConfig = getRoutes(
    Object.values(rolesConfig),
    data?.user.role
  ).filter((item: any) => item.menu[0]);

  return <SlidingMenu menuConfig={menuConfig} />;
}
