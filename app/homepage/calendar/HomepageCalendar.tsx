import { User, getServerSession } from "next-auth";
import RenderCalendar from "./RenderCalendar";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const getReservations = async (id: number) => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list?user_id=${id}`
    );
    const { data } = await req.json();
    return data;
  } catch (e) {
    return [];
  }
};

export default async function HomepageCalendar() {
  const data = (await getServerSession(authOptions)) as { user: User };
  const reservations = data ? await getReservations(data.user.id) : [];

  return <RenderCalendar reservations={reservations} />;
}
