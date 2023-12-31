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

const PastReservations = dynamic(
  () => import("@/app/homepage/pastReservations/PastReservationsWidget")
);
const getUserDetail = async (email: any) => {
  const req = (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/email/${email}`
  )) as any;
  const { data } = await req.json();
  return data[0];
};

export default async function Home({ searchParams }: { searchParams: any }) {
  const user = (await getServerSession(authOptions)) as any;
  const data = await getUserDetail(user?.user.email);

  const homepage = (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(335px, 1fr))" }}
    >
      {rolesConfig.homepage.modules.personalGroups.display.includes(
        user?.user.role.id
      ) && <DisplayGroups searchParams={searchParams} />}
      {rolesConfig.homepage.modules.personalReservations.display.includes(
        user?.user.role.id
      ) && <DisplayReservations searchParams={searchParams} />}
      {rolesConfig.homepage.modules.allReservations.display.includes(
        user?.user.role.id
      ) && <HomepageCalendar />}
      {rolesConfig.homepage.modules.pastReservations.display.includes(
        user?.user.role.id
      ) && <PastReservations user={user} searchParams={searchParams} />}
    </div>
  );

  return <HomepageLoading homepage={homepage} user={data} />;
}
