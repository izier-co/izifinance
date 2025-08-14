"use client";
import { useState } from "react";
import { columns } from "./columns";
import { ServerDataTable } from "@/components/server-datatable";

export default function Page() {
  const [refetchIndex, setRefetchIndex] = useState(0);

  const triggerRefetch = () => {
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
