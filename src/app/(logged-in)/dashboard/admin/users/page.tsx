import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { fetchJSONAPI } from "@/lib/lib";

async function getUsers() {
  const res = await fetchJSONAPI("GET", "/api/v1/auth/admin");
  const data = await res.json();
  return data["data"]["users"];
}

export default async function Page() {
  const data = await getUsers();
  return (
    <>
      <h1 className="font-bold mb-4">Users</h1>
      <DataTable columns={columns} data={data} />
    </>
  );
}
