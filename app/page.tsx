import HomepageLoading from "@/app/HomepageLoading";
import { rolesConfig } from "@/rolesConfig";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { authOptions } from "./api/auth/[...nextauth]/options";

const DisplayReservations = dynamic(
  () => import("@/app/homepage/reservations/DisplayReservations")
);

const DisplayGroups = dynamic(
  () => import("@/app/homepage/groups/DisplayGroups")
);

const HomepageCalendar = dynamic(
  () => import("@/app/homepage/calendar/HomepageCalendar")
);

const getUserDetail = async (email: any) => {
  const req = (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/email/${email}`
  )) as any;
  const { data } = await req.json();
  return data[0];
};

export default async function Home({ searchParams }: { searchParams: any }) {
  const { user } = (await getServerSession(authOptions)) as any;
  const data = await getUserDetail(user.email);

  const homepage = (
    <div className="flex gap-2 h-min">
      {rolesConfig.homepage.modules.personalGroups.display.includes(
        user.role.id
      ) && <DisplayGroups searchParams={searchParams} />}
      {rolesConfig.homepage.modules.personalReservations.display.includes(
        user.role.id
      ) && <DisplayReservations searchParams={searchParams} />}
      {rolesConfig.homepage.modules.allReservations.display.includes(
        user.role.id
      ) && <HomepageCalendar />}
    </div>
  );

  return <HomepageLoading homepage={homepage} user={data} />;
}
