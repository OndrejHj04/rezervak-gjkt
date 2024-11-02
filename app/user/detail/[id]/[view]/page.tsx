import { authOptions } from "@/app/api/auth/[...nextauth]/options"
import { getUserDetail } from "@/lib/api"
import { getServerSession } from "next-auth"
import UserDetailDisplay from "./components/UserDetailDisplay"
import UserDetailForm from "./components/UserDetailForm"
import UserGroupsTable from "./components/UserGroupsTable"
import UserReservationsTable from "./components/UserReservationsTable"

export default async function UserDetailPage({ params, searchParams }: { params: any, searchParams: any }) {
  const { page } = searchParams
  const { view, id } = params
  const { user } = await getServerSession(authOptions) as any
  const { data } = await getUserDetail({ userId: id })

  console.log(data)
  const editable = user.role.id !== 3 || data.parent_id === user.id || user.id === data.id

  if (view === "info") {
    if (editable) {
      return <UserDetailForm userDetail={data} />
    }
    return <UserDetailDisplay userDetail={data} />
  }
  if (view === "groups") {
    return <UserGroupsTable id={id} page={page} />
  }
  if (view === "reservations") {
    return <UserReservationsTable id={id} page={page} />
  }

  return null

}
