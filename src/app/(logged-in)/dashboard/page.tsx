"use client";
import { ReimbursementChart } from "@/components/reimbursement-chart";
import { DashboardCardSkeleton } from "@/components/skeletons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useSidebar } from "@/components/ui/sidebar";
import { fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import { DollarSign, ListTodo, LucideClipboardPlus } from "lucide-react";
import Link from "next/link";

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
    throw new Error(json.error);
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
    throw new Error(json.error);
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
    throw new Error(json.error);
  }
  const json: FetchData = await res.json();
  let totalPending = 0;
  for (let i = 0; i < json.data.length; i++) {
    totalPending += json.data[i].dcNominalReimbursement;
  }
  return totalPending;
}

//unused function
// function LoadingMessage() {
//   return <>Loading Data...</>;
// }

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
      return <DashboardCardSkeleton />;
      // return <LoadingMessage />;
    }
    if (dailyReimbursementQuery.isError) {
      console.error(dailyReimbursementQuery.error.message);
      return <FetchErrorMessage message={"Something went wrong"} />;
    }
    if (dailyReimbursementQuery.data === 0) {
      return (
        <>
          <span className="italic">No more notes since last 24 hours</span>
        </>
      );
    }
    return <>{dailyReimbursementQuery.data} more notes since last 24 hours</>;
  }
  function PendingReimbursementMessage() {
    const pendingQuery = useQuery({
      queryKey: ["pending-query"],
      queryFn: getPendingReimbursements,
    });
    if (pendingQuery.isLoading) {
      return <DashboardCardSkeleton />;
      // return <LoadingMessage />;
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
      return <DashboardCardSkeleton />;
      // return <LoadingMessage />;
    }
    if (pendingValueQuery.isError) {
      console.error(pendingValueQuery.error.message);
      return <FetchErrorMessage message={"Something went wrong"} />;
    }
    return <>IDR {pendingValueQuery.data} worth of reimbursements are still pending</>;
  }

  const { open } = useSidebar();

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className={`grid auto-rows-min xl:grid-cols-3 gap-4 ${open ? "md:grid-rows-auto" : "md:grid-cols-3"}`}>
        <Card className="pr-6 ">
          <div className="flex flex-row md:flex-col-reverse xl:flex-row items-center md:items-start justify-between">
            <div>
              <CardHeader>
                <CardTitle>New Reimbursements</CardTitle>
              </CardHeader>
              <CardContent>
                <DailyReimbursementMessage />
              </CardContent>
            </div>

            <div className="bg-[var(--accent)] rounded-lg p-2 flex items-start  md:mb-4 md:ml-6 self-start justify-center">
              <Link href="/dashboard/reimbursements">
                <LucideClipboardPlus size={24} className="text-[var(--sidebar-accent-foreground)] hover:text-[var(--primarybtnhover)]" />
              </Link>
            </div>
          </div>
        </Card>

        <Card className="pr-6">
          <div className="flex flex-row md:flex-col-reverse xl:flex-row items-center md:items-start justify-between">
            <div>
              <CardHeader>
                <CardTitle>Pending Approval Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <PendingReimbursementMessage />
              </CardContent>
            </div>
            <div className="bg-[var(--accent)] rounded-lg p-2 flex items-start md:ml-6 md:mb-4 self-start justify-center">
              <Link href="/dashboard/reimbursements">
                <ListTodo size={24} className="text-[var(--sidebar-accent-foreground)] hover:text-[var(--primarybtnhover)]" />
              </Link>
            </div>
          </div>
        </Card>

        <Card className="pr-6">
          <div className="flex flex-row md:flex-col-reverse xl:flex-row items-center md:items-start justify-between">
            <div>
              <CardHeader>
                <CardTitle>Reimbursement Value</CardTitle>
              </CardHeader>
              <CardContent>
                <PendingReimbursementValue />
              </CardContent>
            </div>
            <div className="bg-[var(--accent)] rounded-lg p-2 flex items-start md:ml-6 md:mb-4 self-start justify-center">
              <Link href="/dashboard/reimbursements">
                <DollarSign size={24} className="text-[var(--sidebar-accent-foreground)] hover:text-[var(--primarybtnhover)]" />
              </Link>
            </div>
          </div>
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
