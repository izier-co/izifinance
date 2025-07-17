"use client";
import { redirect } from "next/navigation";
import { Button } from "./ui/button";

export function LogoutButton({
  ...props
}: React.ComponentProps<typeof Button>) {
  async function _logout() {
    await fetch("/api/v1/auth/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    redirect("/");
  }
  return (
    <Button type="button" onClick={_logout} className="w-full ">
      Logout
    </Button>
  );
}
