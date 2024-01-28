import HomepageLoading from "@/app/HomepageLoading";
import { rolesConfig } from "@/rolesConfig";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { authOptions } from "./api/auth/[...nextauth]/options";
import fetcher from "@/lib/fetcher";

const BlockDates = dynamic(
  () => import("@/app/homepage/blockDates/BlockDates")
);
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
  const { data } = (await fetcher(`/api/users/email/${email}`)) as any;
  return data[0];
};

export default async function Home({ searchParams }: { searchParams: any }) {
  const user = (await getServerSession(authOptions)) as any;
  const data = user ? await getUserDetail(user?.user.email) : {};

  const homepage = (
    <div
      className="grid gap-2 h-auto"
      style={{ gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}
    >
      {rolesConfig.homepage.modules.personalGroups.display.includes(
        user?.user.role.id
      ) && <DisplayGroups searchParams={searchParams} data={user} />}
      {rolesConfig.homepage.modules.personalReservations.display.includes(
        user?.user.role.id
      ) && <DisplayReservations searchParams={searchParams} data={user} />}
      {rolesConfig.homepage.modules.allReservations.display.includes(
        user?.user.role.id
      ) && <HomepageCalendar user={user} />}
      {rolesConfig.homepage.modules.pastReservations.display.includes(
        user?.user.role.id
      ) && <PastReservations user={user} searchParams={searchParams} />}
      {rolesConfig.homepage.modules.blockDates.display.includes(
        user?.user.role.id
      ) && <BlockDates user={user} />}
    </div>
  );

  return <HomepageLoading homepage={homepage} user={data} />;
}
