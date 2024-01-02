import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import SlidingMenu from "./SlidingMenu";
import { rolesConfig } from "@/rolesConfig";

const getMenu = (config: any, user: any, result: any = []) => {
  config.forEach((item: any) => {
    if (!user) {
      item.roles && !item.roles.length && result.push(item);
    } else {
      if (
        item.menu &&
        item.menu[0] &&
        (!item.roles.length || item.roles.includes(user.user.role.id))
      ) {
        result.push(item);
      } else if (item.modules) {
        getMenu(Object.values(item.modules), user, result);
      }
    }
  });

  return result;
};

export default async function SlidingMenuConfig() {
  const data = (await getServerSession(authOptions)) as any;
  const menuConfig = getMenu(Object.values(rolesConfig), data);

  return <SlidingMenu menuConfig={menuConfig} />;
}
