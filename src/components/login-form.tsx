"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRef } from "react";
import { fetchJSONAPI } from "@/lib/lib";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const inputRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function _handleClick() {
    const loginBody = {
      email: "",
      password: "",
    };

    if (inputRef.current && passwordRef.current) {
      loginBody.email = inputRef.current.value;
      loginBody.password = passwordRef.current.value;
    }

    await fetchJSONAPI("POST", "/api/v1/auth/signin", loginBody);
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email and password</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  ref={inputRef}
                  id="email"
                  type="email"
                  placeholder="username@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                </div>
                <Input
                  ref={passwordRef}
                  id="password"
                  type="password"
                  required
                />
              </div>
              <div className="flex flex-col gap-3">
                <Button type="button" onClick={_handleClick} className="w-full">
                  Login
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
