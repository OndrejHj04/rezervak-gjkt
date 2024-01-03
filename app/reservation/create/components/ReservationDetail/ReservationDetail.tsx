import ReservationDetailRender from "./ReservationDetailRender";

const getUsers = async () => {
  try {
    const req = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/users/list`
    );
    const { data } = await req.json();
    return data;
  } catch (e) {
    return [];
  }
};

export default async function ReservationDetail() {
  const users = await getUsers();
  return <ReservationDetailRender users={users} />;
}
