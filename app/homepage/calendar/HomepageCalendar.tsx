import { User, getServerSession } from "next-auth";
import RenderCalendar from "./RenderCalendar";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";

const getReservations = async (id: number) => {
  const req = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/reservations/list?user_id=${id}`
  );
  const { data } = await req.json();
  return data;
};

export default async function HomepageCalendar() {
  const { user } = (await getServerSession(authOptions)) as { user: User };
  const reservations = await getReservations(user.id);
  
  return <RenderCalendar reservations={reservations} />;
}
