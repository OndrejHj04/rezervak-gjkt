import HomepageLoading from "@/app/HomepageLoading";
import dynamic from "next/dynamic";

const DisplayReservations = dynamic(
  () => import("@/app/homepage/reservations/DisplayReservations")
);

const DisplayGroups = dynamic(
  () => import("@/app/homepage/groups/DisplayGroups")
);

const HomepageCalendar = dynamic(
  () => import("@/app/homepage/calendar/HomepageCalendar")
);

export default function Home({ searchParams }: { searchParams: any }) {
  const homepage = (
    <div className="flex gap-2 h-min">
      <DisplayGroups searchParams={searchParams} />
      <DisplayReservations searchParams={searchParams} />
      <HomepageCalendar />
    </div>
  );

  return <HomepageLoading homepage={homepage} />;
}
