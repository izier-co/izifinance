"use client";

import { fetchJSONAPI } from "@/lib/lib";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";

async function getData(id: string) {
  const data = await fetchJSONAPI("GET", `/api/v1/reimbursements/${id}/notes`);
  const json = await data.json();
  return json["data"][0];
}

function ReimbursementTable({ id }: { id: string }) {
  const dataQuery = useQuery({
    queryKey: ["reimbursement-item-query", id],
    queryFn: () => {
      return getData(id);
    },
  });
  if (dataQuery.isLoading) {
    return <>Loading</>;
  }
  if (dataQuery.isError) {
    console.error(dataQuery.error.message);
    return <>Error : {dataQuery.error.message} </>;
  }
  const data = dataQuery.data;
  return (
    <Table className="mb-6 max-w-[80%] mx-auto">
      <TableHeader>
        <TableRow>
          <TableHead>Information</TableHead>
          <TableHead>Value</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
          <TableCell>Created At</TableCell>
          <TableCell>{data["daCreatedAt"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Updated At</TableCell>
          <TableCell>{data["daUpdatedAt"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Currency</TableCell>
          <TableCell>{data["txCurrency"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Reimbursement ID</TableCell>
          <TableCell>{data["txReimbursementNoteID"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>{data["txStatus"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>{data["txDescriptionDetails"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Recipient Account</TableCell>
          <TableCell>{data["txRecipientAccount"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bank Type Code</TableCell>
          <TableCell>{data["inBankTypeCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Recipient Company Code</TableCell>
          <TableCell>{data["inRecipientCompanyCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bank Account Code</TableCell>
          <TableCell>{data["txBankAccountCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Change Reason</TableCell>
          <TableCell>{data["txChangeReason"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Employee Code</TableCell>
          <TableCell>{data["txEmployeeCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Changed By</TableCell>
          <TableCell>{data["txChangedBy"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total Reimbursement</TableCell>
          <TableCell>{data["dcNominalReimbursement"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Category ID</TableCell>
          <TableCell>{data["inCategoryID"]}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const dataQuery = useQuery({
    queryKey: ["reimbursement-item-query", id],
    queryFn: () => {
      return getData(id);
    },
  });
  if (dataQuery.isLoading) {
    return <>Loading</>;
  }
  if (dataQuery.isError) {
    console.error(dataQuery.error.message);
    return <>Error : {dataQuery.error.message} </>;
  }
  return (
    <>
      <ReimbursementTable id={id} />
      <DataTable
        columns={columns}
        data={dataQuery.data["reimbursement_items"]}
      />
    </>
  );
}
