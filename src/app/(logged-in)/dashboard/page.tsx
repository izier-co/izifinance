"use client";
import { ReimbursementChart } from "@/components/reimbursement-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";

const url = "/api/v1/reimbursements?";

type FetchData = {
  data: Array<{ dcNominalReimbursement: number }>;
  error?: string;
};

async function getDailyReimbursementData(): Promise<number> {
  const MILISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
  const NOW = Date.now();
  const searchParams = new URLSearchParams({
    createdAfter: new Date(NOW - MILISECONDS_IN_DAY).toISOString(),
  }).toString();
  const res = await fetchJSONAPI("GET", url + searchParams);
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json);
  }
  const json: FetchData = await res.json();
  return json.data.length;
}

async function getPendingReimbursements(): Promise<number> {
  const searchParams = new URLSearchParams({
    status: "Pending",
  }).toString();
  const res = await fetchJSONAPI("GET", url + searchParams);
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json);
  }
  const json: FetchData = await res.json();
  return json.data.length;
}

async function getPendingReimbursementValue(): Promise<number> {
  const searchParams = new URLSearchParams({
    status: "Pending",
    currency: "IDR",
  }).toString();
  const res = await fetchJSONAPI("GET", url + searchParams);
  if (!res.ok) {
    const json = await res.json();
    throw new Error(json);
  }
  const json: FetchData = await res.json();
  let totalPending = 0;
  for (let i = 0; i < json.data.length; i++) {
    totalPending += json.data[i].dcNominalReimbursement;
  }
  return totalPending;
}

function LoadingMessage() {
  return <>Loading Data...</>;
}

function FetchErrorMessage({ message }: { message: string }) {
  return <>Error : {message}</>;
}

export default function Page() {
  function DailyReimbursementMessage() {
    const dailyReimbursementQuery = useQuery({
      queryKey: ["daily-reimbursement"],
      queryFn: getDailyReimbursementData,
    });
    if (dailyReimbursementQuery.isLoading) {
      return <LoadingMessage />;
    }
    if (dailyReimbursementQuery.isError) {
      console.error(dailyReimbursementQuery.error.message);
      return <FetchErrorMessage message={"Something went wrong"} />;
    }
    if (dailyReimbursementQuery.data === 0) {
      return <>No more notes since last 24 hours</>;
    }
    return <>{dailyReimbursementQuery.data} more notes since last 24 hours</>;
  }
  function PendingReimbursementMessage() {
    const pendingQuery = useQuery({
      queryKey: ["pending-query"],
      queryFn: getPendingReimbursements,
    });
    if (pendingQuery.isLoading) {
      return <LoadingMessage />;
    }
    if (pendingQuery.isError) {
      console.error(pendingQuery.error.message);
      return <FetchErrorMessage message={"Something went wrong"} />;
    }
    return <>{pendingQuery.data} notes are pending approval overall</>;
  }

  function PendingReimbursementValue() {
    const pendingValueQuery = useQuery({
      queryKey: ["pending-value"],
      queryFn: getPendingReimbursementValue,
    });
    if (pendingValueQuery.isLoading) {
      return <LoadingMessage />;
    }
    if (pendingValueQuery.isError) {
      console.error(pendingValueQuery.error.message);
      return <FetchErrorMessage message={"Something went wrong"} />;
    }
    return (
      <>
        IDR {pendingValueQuery.data} worth of reimbursements are still pending
      </>
    );
  }
  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>New Reimbursements</CardTitle>
          </CardHeader>
          <CardContent>
            <DailyReimbursementMessage />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending Approval Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <PendingReimbursementMessage />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Reimbursement Value</CardTitle>
          </CardHeader>
          <CardContent>
            <PendingReimbursementValue />
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
