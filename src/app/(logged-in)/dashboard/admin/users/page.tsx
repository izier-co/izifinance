import { DataTable } from "@/components/data-table";
import { columns } from "./columns";
import { fetchJSONAPI } from "@/lib/lib";

async function getUsers() {
  const res = await fetchJSONAPI("GET", "/api/v1/auth/admin");
  const data = await res.json();
  console.log(data["data"]["users"]);
  return data["data"]["users"];
}

export default async function Page() {
  const data = await getUsers();
  return (
    <>
      <h1>Users Page</h1>
      <DataTable columns={columns} data={data} />
    </>
  );
}
