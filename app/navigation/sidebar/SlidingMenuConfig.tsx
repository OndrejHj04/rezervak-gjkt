import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SlidingMenu from "./SlidingMenu";
import { sideMenu } from "@/lib/rolesConfig";


export default async function SlidingMenuConfig() {
  const user = (await getServerSession(authOptions)) as any;

  if (!user) return null
  const filterMenu = sideMenu.filter((item) => {
    if (item.roles?.length) {
      return item.roles.includes(user.user.role.id)
    }
    return item
  })
  return <SlidingMenu menuConfig={filterMenu} user={user} />;
}
