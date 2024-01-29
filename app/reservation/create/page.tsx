import CreateReservationWrapper from "./CreateReservationWrapper";

export default async function CreateReservation({
  searchParams,
}: {
  searchParams: any;
}) {
  return <CreateReservationWrapper searchParams={searchParams}/>;
}
