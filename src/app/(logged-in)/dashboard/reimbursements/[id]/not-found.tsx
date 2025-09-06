import { Button } from "@/components/ui/button";
import { SearchX } from "lucide-react";
import Link from "next/link";

export default function Page() {
  return (
    <>
      <div className="flex flex-col items-center justify-center h-160 content-center">
        <div className="mb-4 ">
          <SearchX className="size-30 mb-8 text-[var(--destructive)]" />
          <p className="font-bold mb-2">Erorr 404</p>
          <p className="font-bold text-3xl mb-4">Page not found!</p>
          <p className="mb-4">The page you&apos;re trying to access doesn&apos;t exist or has been removed.</p>
        </div>
        <Link href="/dashboard/reimbursements">
          <Button variant="default">Go Back</Button>
        </Link>
      </div>
    </>
  );
}
