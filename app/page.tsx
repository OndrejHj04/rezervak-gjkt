import HomepageLoading from "@/app/HomepageLoading";
import { getServerSession } from "next-auth";
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

const getUserDetail = async (email: any) => {
  const req = (await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/email/${email}`
  )) as any;
  const { data } = await req.json();
  return data[0];
};

export default async function Home({ searchParams }: { searchParams: any }) {
  const user = (await getServerSession()) as any;
  const data = await getUserDetail(user?.user.email);

  const homepage = (
    <div className="flex gap-2 h-min">
      <DisplayGroups searchParams={searchParams} />
      <DisplayReservations searchParams={searchParams} />
      <HomepageCalendar />
    </div>
  );

  return <HomepageLoading homepage={homepage} user={data} />;
}
