import { fetchJSONAPI } from "@/lib/lib";
import { columns } from "./columns";
import { DataTable } from "@/components/data-table";

async function getData(id: string) {
  const data = await fetchJSONAPI("GET", `/api/v1/reimbursements/${id}/notes`);
  const json = await data.json();
  return json["data"][0];
}

export default async function Page(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const data = await getData(params.id);
  return (
    <div className="">
      <ol>
        <li>Created At : {data["daCreatedAt"]}</li>
        <li>Updated At : {data["daUpdatedAt"]}</li>
        <li>Reimbursement ID : {data["txReimbursementNoteID"]}</li>
        <li>Status : {data["txStatus"]}</li>
        <li>Description : {data["txDescriptionDetails"]}</li>
        <li>Recipient Account : {data["txRecipientAccount"]}</li>
        <li>Bank Type Code : {data["inBankTypeCode"]}</li>
        <li>Recipient Company Code : {data["inRecipientCompanyCode"]}</li>
        <li>Bank Account Code : {data["txBankAccountCode"]}</li>
        <li>Change Reason : {data["txChangeReason"]}</li>
        <li>Employee Code : {data["txEmployeeCode"]}</li>
        <li>Approved By : {data["txApprovedBy"]}</li>
        <li>Total Reimbursement : {data["dcNominalReimbursement"]}</li>
        <li>Category ID : {data["inCategoryID"]}</li>
      </ol>
      <DataTable columns={columns} data={data["reimbursement_items"]} />
    </div>
  );
}
