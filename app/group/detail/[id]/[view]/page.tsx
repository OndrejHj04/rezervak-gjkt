import { getServerSession } from "next-auth"
import GroupUsersTable from "./components/GroupUsersTable"
import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import GroupReservationsTable from "./components/GroupReservationsTable"
import { getGroupDetail } from "@/lib/api"
import GroupDetailForm from "./components/GroupDetailForm"
import GroupDetailDisplay from "./components/GroupDetailDisplay"

export default async function GroupDetailPage({ params, searchParams }: { params: any, searchParams: any }) {
  const { page } = searchParams
  const { view, id } = params
  const { user } = await getServerSession(authOptions) as any
  const { data } = await getGroupDetail({ groupId: id })

  if (view === "info") {
    if (user.role.id === 3) {
      return <GroupDetailDisplay groupDetail={data} />
    }
    return <GroupDetailForm groupDetail={data} />
  }
  if (view === "users") {
    return <GroupUsersTable id={id} page={page} />
  }
  if (view === "reservations") {
    return <GroupReservationsTable id={id} page={page} />
  }

  return null
}
