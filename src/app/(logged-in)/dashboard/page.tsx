import { ChartLineDefault } from "@/components/chart-line-default";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJSONAPI } from "@/lib/lib";

async function getDashboardData() {
  const url = "/api/v1/reimbursements?";
  const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
  const NOW = Date.now();
  const oneDayParams = new URLSearchParams({
    createdAfter: new Date(NOW - MILISECONDS_IN_DAY).toISOString(),
  }).toString();
  const pendingParams = new URLSearchParams({
    status: "Pending",
  }).toString();
  const idrPendingParams = new URLSearchParams({
    currency: "IDR",
    status: "Pending",
  }).toString();
  const oneDayReimbursements = await fetchJSONAPI("GET", url + oneDayParams);
  const oneDayJson = await oneDayReimbursements.json();
  const reimbursementInOneDayCount = oneDayJson.data.length;
  const pendingReimbursements = await fetchJSONAPI("GET", url + pendingParams);
  const pendingJson = await pendingReimbursements.json();
  const pendingReimbursementsCount = pendingJson.data.length;
  const idrPendingReimbursements = await fetchJSONAPI(
    "GET",
    url + idrPendingParams
  );
  const idrPendingJson = await idrPendingReimbursements.json();
  let totalPending = 0;
  for (let i = 0; i < idrPendingJson.data.length; i++) {
    totalPending = idrPendingJson.data[i].deTotalReimbursement;
  }
  return {
    oneDayCount: reimbursementInOneDayCount,
    pendingCount: pendingReimbursementsCount,
    pendingValue: totalPending,
  };
}

export default async function Page() {
  const displayData = await getDashboardData();
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>New Reimbursements</CardTitle>
          </CardHeader>
          <CardContent>
            +{displayData.oneDayCount} more notes since last 24 hours
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {displayData.pendingCount} notes are pending approval overall
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reimbursement Value</CardTitle>
          </CardHeader>
          <CardContent>
            IDR {displayData.pendingValue} worth of reimbursements are still
            pending
          </CardContent>
        </Card>
      </div>
      <ChartLineDefault />
    </div>
  );
}
