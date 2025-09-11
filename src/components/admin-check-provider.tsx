import { getEmpInfo } from "@/queries/server-queries";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export async function AdminProvider({ children }: { children: ReactNode }) {
  const adminStatus = await getEmpInfo();
  if (adminStatus.boHasAdminAccess === false) {
    return redirect("/dashboard");
  }
  return <div>{children}</div>;
}
