import { fetchJSONAPI } from "@/lib/lib";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { Suspense } from "react";

async function CustomDataTable() {
  const data = await fetchJSONAPI("GET", "/api/v1/reimbursements");
  const json = await data.json();
  return <DataTable columns={columns} data={json["data"]} />;
}

export default async function Page() {
  return (
    <div className="">
      <h1 className="text-bold mb-4">Reimbursements</h1>
      <Suspense fallback={<>Loading...</>}>
        <CustomDataTable />
      </Suspense>
    </div>
  );
}
