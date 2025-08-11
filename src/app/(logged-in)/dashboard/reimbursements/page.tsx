import { columns } from "./columns";
import { ReimbursementDatatable } from "@/components/reimbursement-datatable";

export default function Page() {
  return (
    <>
      <h1 className="text-bold mb-4">Reimbursements</h1>
      <ReimbursementDatatable columns={columns} />
    </>
  );
}
