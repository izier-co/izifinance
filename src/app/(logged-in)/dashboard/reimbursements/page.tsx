"use client";

import { fetchJSONAPI } from "@/lib/lib";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";
import { useQuery } from "@tanstack/react-query";

async function getData() {
  const data = await fetchJSONAPI("GET", "/api/v1/reimbursements");
  const json = await data.json();
  return json.data;
}

export default function Page() {
  const dataQuery = useQuery({
    queryKey: ["reimbursement-query"],
    queryFn: getData,
  });
  if (dataQuery.isLoading) {
    return <>Loading</>;
  }
  if (dataQuery.error) {
    console.error(dataQuery.error.message);
    return <>Error : {dataQuery.error.message}</>;
  }
  return (
    <>
      <h1 className="text-bold mb-4">Reimbursements</h1>
      <DataTable columns={columns} data={dataQuery.data} />
    </>
  );
}
