import { fetchJSONAPI } from "@/lib/server-lib";
import { columns, ReimbursementItems } from "./columns";
import { DataTable } from "@/components/data-table";

async function getData(id: string): Promise<Array<ReimbursementItems>> {
  const data = await fetchJSONAPI("GET", `/api/v1/reimbursements/${id}/notes`);
  const json = await data.json();
  return json["data"][0]["reimbursement_items"];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await getData(params.id);
  return (
    <div className="">
      <DataTable columns={columns} data={data} />
    </div>
  );
}
