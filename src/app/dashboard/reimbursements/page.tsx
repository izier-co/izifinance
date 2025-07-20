import { fetchJSONAPI } from "@/lib/lib";
import { columns, ReimbursementPayload } from "./columns";
import { DataTable } from "@/components/data-table";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { cookies } from "next/headers";

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

// async function getData(): Promise<ReimbursementPayload> {
//   const data = await fetchJSONAPI("GET", "/api/v1/reimbursements");
//   const json = await data.json();

//   if (!Array.isArray(json["data"])) {
//     throw new Error("Expected array response");
//   }
//   const dataArr = json["data"];
//   const users = dataArr.map((item) => payloadSchema.parse(item));
//   return users;
// }

async function getData(): Promise<Array<ReimbursementPayload>> {
  const cookieStore = await cookies();
  const allCookies = cookieStore.getAll();

  const data = await fetch("http://localhost:3000/api/v1/reimbursements", {
    credentials: "include",
    cache: "no-store",
    headers: {
      Cookie: allCookies
        .map((cookie) => `${cookie.name}=${cookie.value}`)
        .join("; "),
    },
  });
  const json = await data.json();
  console.log(json);
  return [
    {
      daCreatedAt: "2025-07-19T00:00:00.000Z",
      daUpdatedAt: "2025-07-19T00:00:00.000Z",
      txStatus: "Pending",
      txDescriptionDetails: "abcdef",
      txRecipientAccount: "12345",
      inBankTypeCode: 1,
      inRecipientCompanyCode: 10,
      txBankAccountCode: "1",
      txChangeReason: "abc",
      txEmployeeCode: "AAAAA",
      inCategoryID: 100,
      dcNominalReimbursement: 10000,
    },
    {
      daCreatedAt: "2025-07-18T00:00:00.000Z",
      daUpdatedAt: "2025-07-18T00:00:00.000Z",
      txStatus: "Paid",
      txDescriptionDetails: "ghijkl",
      txRecipientAccount: "12500",
      inBankTypeCode: 2,
      inRecipientCompanyCode: 20,
      txBankAccountCode: "2",
      txChangeReason: "def",
      txEmployeeCode: "BBBBB",
      inCategoryID: 200,
      dcNominalReimbursement: 20000,
    },
    {
      daCreatedAt: "2025-07-17T00:00:00.000Z",
      daUpdatedAt: "2025-07-17T00:00:00.000Z",
      txStatus: "Void",
      txDescriptionDetails: "mnopqr",
      txRecipientAccount: "13678",
      inBankTypeCode: 3,
      inRecipientCompanyCode: 30,
      txBankAccountCode: "3",
      txChangeReason: "ghi",
      txEmployeeCode: "CCCCC",
      inCategoryID: 300,
      dcNominalReimbursement: 30000,
    },
    {
      daCreatedAt: "2025-07-16T00:00:00.000Z",
      daUpdatedAt: "2025-07-16T00:00:00.000Z",
      txStatus: "Approved",
      txDescriptionDetails: "stuvwx",
      txRecipientAccount: "14100",
      inBankTypeCode: 4,
      inRecipientCompanyCode: 40,
      txBankAccountCode: "4",
      txChangeReason: "jkl",
      txEmployeeCode: "DDDDD",
      inCategoryID: 400,
      dcNominalReimbursement: 40000,
    },
  ];
}

export default async function Page() {
  const data = await getData();
  return (
    <div className="">
      <DataTable columns={columns} data={data} />
      {/* <Button onClick={getData}></Button> */}
    </div>
  );
}
