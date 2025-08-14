import { isAdmin } from "@/queries/queries";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export async function AdminProvider({ children }: { children: ReactNode }) {
  const adminStatus = await isAdmin();
  if (adminStatus === false) {
    return redirect("/dashboard");
  }
  return <div>{children}</div>;
}
