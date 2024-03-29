import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import TopBarComponent from "./TopBarComponent";
import { getUserTheme } from "@/lib/api";

export default async function TopBar() {
  const data = (await getServerSession(authOptions)) as any;
  const { theme } = await getUserTheme();

  return <TopBarComponent theme={theme} id={data?.user.id} />;
}
