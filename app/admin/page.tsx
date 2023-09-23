import AdminCredentials from "@/components/adminCredentials";
import RolesComponent from "@/components/rolesComponent";
import WhiteList from "@/components/whiteList";
import { AdminCredentialsType } from "@/models/User";

async function getAdminCredentials() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/credentials",
    { cache: "no-cache" }
  );
  const { data } = await res.json();
  return data[0] as AdminCredentialsType; //attention
}

export default async function Admin() {
  const data = await getAdminCredentials();

  return (
    <div className="flex gap-2">
      <AdminCredentials data={data} />
      <WhiteList />
      <RolesComponent />
    </div>
  );
}
