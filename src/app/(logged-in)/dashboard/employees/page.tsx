"use client";
import { useState } from "react";
import { columns } from "./columns";
import { ServerDataTable } from "@/components/server-datatable";

export default function Page() {
  const [refetchIndex, setRefetchIndex] = useState(0);

  // This is the function we need to call from the dropdown menu
  const triggerRefetch = () => {
    console.log("Refetch triggered!");
    setRefetchIndex((prevIndex) => prevIndex + 1);
  };
  return (
    <>
      <h1 className="text-bold mb-4">Employees</h1>
      <ServerDataTable
        columns={columns}
        rowName="employees"
        refetchIndex={refetchIndex}
        triggerRefetch={triggerRefetch}
      />
    </>
  );
}
