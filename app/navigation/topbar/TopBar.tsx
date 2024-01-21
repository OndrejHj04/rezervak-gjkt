import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import TopBarComponent from "./TopBarComponent";
import fetcher from "@/lib/fetcher";

const getUserTheme = async (id: string) => {
  const { data } = await fetcher(`/api/users/detail/${id}/theme`);
  return data;
};

export default async function TopBar() {
  const data = (await getServerSession(authOptions)) as any;
  const theme = data?.user?.id
    ? await getUserTheme(data?.user?.id)
    : { theme: 1 };

  return <TopBarComponent theme={theme?.theme} id={data?.user.id} />;
}
