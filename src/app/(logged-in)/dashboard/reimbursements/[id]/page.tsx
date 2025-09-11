"use client";

import { fetchJSONAPI } from "@/lib/lib";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { use } from "react";
import { DetailViewSkeleton } from "@/components/skeletons";
import { notFound } from "next/navigation";
import z from "zod";
<<<<<<< HEAD
import { MixedText } from "@/components/mixed-text";
=======
>>>>>>> 3dca31a (Add employees admin page (#3))

const randomUUIDStringSchema = z
  .string()
  .length(7)
  .refine((str) => !isNaN(Number.parseInt(str, 16)));

async function getData(id: string) {
  const data = await fetchJSONAPI("GET", `/api/v1/reimbursements/${id}/full-data`);
  const json = await data.json();
  if (!data.ok) {
    throw new Error(json.error);
  }
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
    if (dataQuery.error.message.includes("data is undefined")) {
      notFound();
    }
    console.error(dataQuery.error.message);
    return <>Error : {dataQuery.error.message} </>;
  }
  const data = dataQuery.data;
  if (data.length === 0) {
    notFound();
  }
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
<<<<<<< HEAD
          <TableCell>
            <MixedText value={new Date(data["daCreatedAt"]).toLocaleString()} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Updated At</TableCell>
          <TableCell>
            <MixedText value={new Date(data["daUpdatedAt"]).toLocaleString()} />
          </TableCell>
=======
          <TableCell>{new Date(data["daCreatedAt"]).toLocaleString()}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Updated At</TableCell>
          <TableCell>{new Date(data["daUpdatedAt"]).toLocaleString()}</TableCell>
>>>>>>> 3dca31a (Add employees admin page (#3))
        </TableRow>
        <TableRow>
          <TableCell>Currency</TableCell>
          <TableCell>{data["txCurrency"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Reimbursement ID</TableCell>
          <TableCell>
            <MixedText value={data["txReimbursementNoteID"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Status</TableCell>
          <TableCell>{data["txStatus"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Description</TableCell>
          <TableCell>
            <MixedText value={data["txDescriptionDetails"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bank Name</TableCell>
          <TableCell>{data["issuer_emp_data"]["m_bank"]["txBankName"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Bank Account Code</TableCell>
          <TableCell>{data["issuer_emp_data"]["txBankAccountCode"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Change Reason</TableCell>
          <TableCell>
            <MixedText value={data["txChangeReason"]} />
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Issued By</TableCell>
          <TableCell>{data["issuer_emp_data"]["txFullName"]}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Changed By</TableCell>
          <TableCell>{data["admin_emp_data"] ? data["admin_emp_data"]["txFullName"] : "None"}</TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Total Reimbursement Value</TableCell>
          <TableCell>
<<<<<<< HEAD
            <span>{data["txCurrency"]}</span> <MixedText value={String(data["dcNominalReimbursement"])} />
=======
            {data["txCurrency"]} {data["dcNominalReimbursement"]}
>>>>>>> 3dca31a (Add employees admin page (#3))
          </TableCell>
        </TableRow>
        <TableRow>
          <TableCell>Category</TableCell>
          <TableCell>{data["m_category"]["txCategoryName"]}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  );
}
export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const validatedID = randomUUIDStringSchema.safeParse(id);
  if (validatedID.error) {
    throw new Error(validatedID.error.message);
  }
  const dataQuery = useQuery({
    queryKey: ["reimbursement-item-query", id],
    queryFn: () => {
      return getData(id);
    },
  });
  if (dataQuery.isLoading) {
    return <DetailViewSkeleton />;
  }
  if (dataQuery.isError) {
    if (dataQuery.error.message.includes("data is undefined")) {
      notFound();
    }
    console.error(dataQuery.error.message);
    return <>Error : {dataQuery.error.message} </>;
  }

  const data = dataQuery.data;
  if (data.length === 0) {
    notFound();
  }
  return (
    <>
      <ReimbursementTable id={id} />
      <DataTable columns={columns} data={dataQuery.data["reimbursement_items"]} />
    </>
  );
}
