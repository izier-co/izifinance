import { fetchJSONAPI } from "@/lib/server-lib";
import { columns, Reimbursements } from "./columns";
import { DataTable } from "@/components/data-table";

async function getData(): Promise<Array<Reimbursements>> {
  const data = await fetchJSONAPI("GET", "/api/v1/reimbursements");
  const json = await data.message;
  return json["data"];
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
