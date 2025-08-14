"use client";
import { useState } from "react";
import { columns } from "./columns";
import { ReimbursementDatatable } from "@/components/reimbursement-datatable";

export default function Page() {
  const [refetchIndex, setRefetchIndex] = useState(0);

  const triggerRefetch = () => {
    setRefetchIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <>
      <h1 className="text-bold mb-4">Reimbursements</h1>
      <ReimbursementDatatable
        columns={columns}
        refetchIndex={refetchIndex}
        triggerRefetch={triggerRefetch}
      />
    </>
  );
}
