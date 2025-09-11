"use client";

import { Button } from "@/components/ui/button";
import { TriangleAlert } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center pt-25">
        <div className="mb-4 ">
          <TriangleAlert className="size-30 mb-8 text-[var(--destructive)]" />
          <p className="font-bold mb-2">Opss..</p>
          <p className="font-bold text-3xl mb-4">Something Went Wrong</p>
          <p className="mb-4">We are working on fixing the problem. Please try again later.</p>
        </div>
        <Link href="/dashboard">
          <Button variant="default">Go Back to Dashboard</Button>
        </Link>
      </div>
    </>
  );
}
