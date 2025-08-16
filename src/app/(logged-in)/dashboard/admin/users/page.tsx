import { DataTable } from "@/components/data-table";
import { columns } from "./columns";

export default function Page() {
  return (
    <>
      <h1>Users Page</h1>
      <DataTable columns={columns} data={{}} />
    </>
  );
}
