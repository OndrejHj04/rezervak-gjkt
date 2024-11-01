import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { getReservationDetail } from "@/lib/api"
import { getServerSession } from "next-auth"
import ReservationDetailDisplay from "./components/ReservationDetailDisplay"
import ReservationDetailForm from "./components/ReservationDetailForm"
import ReservationUsersTable from "./components/ReservationUsersTable"
import ReservationGroupsTable from "./components/ReservationGroupsTable"
import ReservationTimeline from "./components/ReservationTimeline"
import ReservationRegistration from "./components/ReservationRegistration"

export default async function ReservationDetailPage({ params, searchParams }: { params: any, searchParams: any }) {
  const { page, timeline } = searchParams
  const { view, id } = params
  const { user } = await getServerSession(authOptions) as any
  const { data } = await getReservationDetail({ reservationId: id })


  if (view === "info") {
    if (user.role.id === 1) {
      return <ReservationDetailDisplay reservationDetail={data} />
    }
    return <ReservationDetailForm reservationDetail={data} />
  }
  if (view === "groups") {
    return <ReservationGroupsTable id={id} page={page} />
  }

  if (view === "users") {
    return <ReservationUsersTable id={id} page={page} />
  }

  if (view === "timeline") {
    return <ReservationTimeline id={id} page={page} timeline={timeline} />
  }

  if (view === "registration") {
    return <ReservationRegistration id={id} page={page} />
  }

  return null

}
