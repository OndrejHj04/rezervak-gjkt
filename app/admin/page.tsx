import AdminCredentials from "@/components/adminCredentials";
import RolesComponent from "@/components/rolesComponent";
import { AdminCredentialsType } from "@/models/User";

async function getAdminCredentials() {
  const res = await fetch(
    process.env.NEXT_PUBLIC_API_URL + "/api/admin/credentials"
  );
  const { data } = await res.json();
  return data[0] as AdminCredentialsType; //attention
}

export default async function Admin() {
  const data = await getAdminCredentials();

  return (
    <div className="flex gap-2">
      <AdminCredentials data={data} />
      {/* <RolesComponent /> */}
    </div>
  );
}
