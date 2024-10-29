import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { getUserDetail } from "@/lib/api"
import { getServerSession } from "next-auth"

export default async function ReservationDetailPage({ params, searchParams }: { params: any, searchParams: any }) {
  const { page } = searchParams
  const { view, id } = params
  const { user } = await getServerSession(authOptions) as any
  const { data } = await getReservationDetail({ userId: id })


  if (view === "info") {
    if (user.role.id === 3) {
      return <UserDetailDisplay userDetail={data} />
    }
    return <UserDetailForm userDetail={data} />
  }
  if (view === "groups") {
    return <UserGroupsTable id={id} page={page} />
  }
  if (view === "reservations") {
    return <UserReservationsTable id={id} />
  }

  return null

}
