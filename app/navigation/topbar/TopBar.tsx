import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import TopBarComponent from "./TopBarComponent";

const getUserTheme = async (id: string) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/detail/${id}/theme`
  );
  const { data } = await req.json();
  return data;
};

export default async function TopBar() {
  const data = (await getServerSession(authOptions)) as any;
  const theme = data?.user?.id
    ? await getUserTheme(data?.user?.id)
    : { theme: 1 };

  return <TopBarComponent theme={theme?.theme} id={data?.user.id} />;
}
