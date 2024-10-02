import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SlidingMenu from "./SlidingMenu";
import { getRoutes, rolesConfig } from "@/lib/rolesConfig";
import changelog from "@/app/changelog/changelog.data"

export default async function SlidingMenuConfig() {
  const data = (await getServerSession(authOptions)) as any;
  const currentVersion = changelog.versions[0].title
  const menuConfig = getRoutes(
    Object.values(rolesConfig),
    data?.user.role
  ).filter((item: any) => item.menu[0]);

  return <SlidingMenu menuConfig={menuConfig} version={currentVersion} />;
}
