"use client";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { fetchJSONAPI } from "@/lib/lib";

export function LogoutButton({
  ...props
}: React.ComponentProps<typeof Button>) {
  async function _logout() {
    await fetchJSONAPI("POST", "/api/v1/auth/logout");
    redirect("/");
  }
  return (
    <Button type="button" onClick={_logout} className="w-full ">
      Logout
    </Button>
  );
}
