import { columns } from "./columns";
import { ServerDataTable } from "@/components/server-datatable";

export default function Page() {
  return (
    <>
      <h1 className="text-bold mb-4">Categories</h1>
      <ServerDataTable columns={columns} rowName="categories" />
    </>
  );
}
