import { ReimbursementChart } from "@/components/reimbursement-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJSONAPI } from "@/lib/lib";
import { Suspense } from "react";

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

function LoadingMessage() {
  return <>Loading Data...</>;
}

function FetchErrorMessage({
  message,
  code,
}: {
  message: string;
  code: number;
}) {
  return (
    <>
      Error : {message} ({code})
    </>
  );
}

async function DailyReimbursementMessage() {
  const reimbursementCount = await getDailyReimbursementData();
  return <>+{reimbursementCount} more notes since last 24 hours</>;
}

async function PendingReimbursementMessage() {
  const pendingCount = await getPendingReimbursements();
  return <>{pendingCount} notes are pending approval overall</>;
}

async function PendingReimbursementValue() {
  const pendingReimbursementValue = await getPendingReimbursementValue();
  return (
    <>
      IDR {pendingReimbursementValue} worth of reimbursements are still pending
    </>
  );
}

export default async function Page() {
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>New Reimbursements</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingMessage />}>
              <DailyReimbursementMessage />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingMessage />}>
              <PendingReimbursementMessage />
            </Suspense>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reimbursement Value</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<LoadingMessage />}>
              <PendingReimbursementValue />
            </Suspense>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Reimbursement Volume in this month</CardTitle>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<LoadingMessage />}>
            <ReimbursementChart />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
