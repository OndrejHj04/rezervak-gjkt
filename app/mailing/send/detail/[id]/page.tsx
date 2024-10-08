import { getSendMailDetail } from "@/lib/api"
import MailDetailForm from "./MailDetailForm"

export default async function Page({ params: { id } }: any) {
  const { data } = await getSendMailDetail(id)

  return <MailDetailForm data={data} />
}
