import { ReimbursementChart } from "@/components/reimbursement-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJSONAPI } from "@/lib/lib";

const url = "/api/v1/reimbursements?";

type FetchData = {
  data: Array<any>;
  error?: string;
};

async function getDailyReimbursementData(): Promise<number> {
  const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
  const NOW = Date.now();
  const searchParams = new URLSearchParams({
    createdAfter: new Date(NOW - MILISECONDS_IN_DAY).toISOString(),
  }).toString();
  const res = await fetchJSONAPI("GET", url + searchParams);
  const json: FetchData = await res.json();
  return json.data.length;
}

async function getPendingReimbursements(): Promise<number> {
  const searchParams = new URLSearchParams({
    status: "Pending",
  }).toString();
  const res = await fetchJSONAPI("GET", url + searchParams);
  const json: FetchData = await res.json();
  return json.data.length;
}

async function getPendingReimbursementValue(): Promise<number> {
  const searchParams = new URLSearchParams({
    status: "Pending",
  }).toString();
  const res = await fetchJSONAPI("GET", url + searchParams);
  const json: FetchData = await res.json();
  let totalPending = 0;
  for (let i = 0; i < json.data.length; i++) {
    totalPending = json.data[i].dcNominalReimbursement;
  }
  return totalPending;
}

export default async function Page() {
  const reimbursementCount = await getDailyReimbursementData();
  const pendingCount = await getPendingReimbursements();
  const pendingReimbursementValue = await getPendingReimbursementValue();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>New Reimbursements</CardTitle>
          </CardHeader>
          <CardContent>
            +{reimbursementCount} more notes since last 24 hours
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingCount} notes are pending approval overall
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reimbursement Value</CardTitle>
          </CardHeader>
          <CardContent>
            IDR {pendingReimbursementValue} worth of reimbursements are still
            pending
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reimbursement Volume in this month</CardTitle>
        </CardHeader>
        <CardContent>
          <ReimbursementChart />
        </CardContent>
      </Card>
    </div>
  );
}
