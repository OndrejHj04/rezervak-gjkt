import CalendarWidget from "./CalendarWidget";
import GroupWidget from "./GroupsWidget";
import ReservationsWidget from "./ReservationsWidget";

export default function Page({ searchParams }: { searchParams: any }) {

  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 flex sm:flex-row flex-col gap-2">
        <div
          className="grid grid-rows-2 gap-2"
        >
          <GroupWidget />
          <ReservationsWidget />
        </div>
        <CalendarWidget searchParams={searchParams} />
      </div>
    </div>
  )
}
