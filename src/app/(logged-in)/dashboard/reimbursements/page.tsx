import { fetchJSONAPI } from "@/lib/lib";
import { columns, Reimbursements } from "./columns";
import { DataTable } from "@/components/data-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

async function getData(): Promise<Array<Reimbursements>> {
  const data = await fetchJSONAPI("GET", "/api/v1/reimbursements");
  const json = await data.json();
  return json["data"];
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="flex flex-col">
      <Link className="ml-auto mb-2" href="/dashboard/reimbursements/add">
        <Button className="">Add Reimbursement</Button>
      </Link>
      <DataTable columns={columns} data={data} />
    </div>
  );
}
