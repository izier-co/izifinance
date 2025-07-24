import { fetchJSONAPI } from "@/lib/lib";
import { columns, Categories } from "./columns";
import { DataTable } from "@/components/data-table";

async function getData(): Promise<Array<Categories>> {
  const data = await fetchJSONAPI("GET", "/api/v1/categories");
  const json = await data.json();
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
