import HomepageLoading from "@/app/HomepageLoading";
import { rolesConfig } from "@/lib/rolesConfig";
import { getServerSession } from "next-auth";
import dynamic from "next/dynamic";
import { authOptions } from "./api/auth/[...nextauth]/options";
import fetcher from "@/lib/fetcher";
import { getUserDetailByEmail } from "@/lib/api";

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

const WeatherWidget = dynamic(
  () => import("@/app/homepage/weatherWidget/weatherWidget")
);

export default async function Home({ searchParams }: { searchParams: any }) {
  const user = (await getServerSession(authOptions)) as any;

  const data: any = user
    ? await getUserDetailByEmail({ email: user?.user.email })
    : [];

  const homepage = (
    <div className="flex flex-col gap-2">
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
        ) && <HomepageCalendar />}
        {rolesConfig.homepage.modules.pastReservations.display.includes(
          user?.user.role.id
        ) && <PastReservations searchParams={searchParams} />}
        {rolesConfig.homepage.modules.blockDates.display.includes(
          user?.user.role.id
        ) && <BlockDates user={user} />}
        {rolesConfig.homepage.modules.weatherWidget.display.includes(
          user?.user.role.id
        ) && <WeatherWidget />}
      </div>
    </div>
  );

  return <HomepageLoading homepage={homepage} user={data[0]} />;
}
