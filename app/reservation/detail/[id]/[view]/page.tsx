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
  const isAdmin = user.role.id !== 3
  const isLeader = data.leader_id === user.id
  const editable = data.status_id !== 1 && (isAdmin || isLeader)

  if (view === "info") {
    if (editable) {
      return <ReservationDetailForm reservationDetail={data} />
    }
    return <ReservationDetailDisplay reservationDetail={data} />
  }
  if (view === "groups") {
    return <ReservationGroupsTable id={id} page={page} />
  }

  if (view === "users") {
    return <ReservationUsersTable id={id} page={page} editable={editable} />
  }

  if (view === "timeline") {
    return <ReservationTimeline id={id} page={page} timeline={timeline} />
  }

  if (view === "registration") {
    return <ReservationRegistration id={id} page={page} />
  }

  return null

}
