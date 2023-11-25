import HomepageLoading from "@/app/HomepageLoading";
import dynamic from "next/dynamic";

const DisplayGroups = dynamic(
  () => import("@/app/homepage/reservations/DisplayReservations")
);

const DisplayReservations = dynamic(
  () => import("@/app/homepage/groups/DisplayGroups")
);

const HomepageCalendar = dynamic(
  () => import("@/app/homepage/calendar/HomepageCalendar")
);

export default function Home() {
  const homepage = (
    <div className="flex gap-2 h-min">
      <DisplayGroups />
      <DisplayReservations />
      <HomepageCalendar />
    </div>
  );

  return <HomepageLoading homepage={homepage} />;
}
