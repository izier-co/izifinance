import { fetchJSONAPI } from "@/lib/server-lib";
import { columns, ReimbursementPayload } from "./columns";
import { DataTable } from "@/components/data-table";
import { z } from "zod";

const payloadSchema = z.object({
  daCreatedAt: z.string(),
  daUpdatedAt: z.string(),
  txStatus: z.string(),
  txDescriptionDetails: z.string(),
  txRecipientAccount: z.string(),
  inBankTypeCode: z.number(),
  inRecipientCompanyCode: z.number(),
  txBankAccountCode: z.string(),
  txChangeReason: z.string(),
  txEmployeeCode: z.string(),
  inCategoryID: z.number(),
  dcNominalReimbursement: z.number(),
});

async function getData(): Promise<Array<ReimbursementPayload>> {
  const data = await fetchJSONAPI("GET", "/api/v1/reimbursements");
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
