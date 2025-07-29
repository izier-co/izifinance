import { fetchJSONAPI } from "@/lib/lib";
import { columns, Reimbursements } from "./columns";
import { DataTable } from "@/components/data-table";

async function getData(): Promise<Array<Reimbursements>> {
  const data = await fetchJSONAPI("GET", "/api/v1/reimbursements");
  const json = await data.json();
  return json["data"];
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="">
      <h1 className="text-bold mb-4">Reimbursements</h1>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
