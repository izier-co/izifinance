"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { useRef, useState } from "react";
import { redirect } from "next/navigation";
import { fetchJSONAPI } from "@/lib/server-lib";

export default function Home() {
  const inputRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [serverError, setServerError] = useState("");

  type LoginObject = {
    email: string;
    password: string;
  };

  function validateEmail() {
    const loginErrors: LoginObject = {
      email: "",
      password: "",
    };
    if (inputRef.current?.value === "") {
      loginErrors.email = "Email must not be empty";
    } else if (!inputRef.current?.value.includes("@")) {
      loginErrors.email = "Email must contain @ symbol";
    }

    if (passwordRef.current?.value === "") {
      loginErrors.password = "Password must not be empty";
    }
    return loginErrors;
  }

  async function _handleClick() {
    const loginObject: LoginObject = {
      email: inputRef.current?.value || "",
      password: passwordRef.current?.value || "",
    };

    const validationErr = validateEmail();
    if (validationErr.email || validationErr.password) {
      setErrors(validationErr);
    } else {
      const res = await fetch("http://localhost:3000/api/v1/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginObject),
      });

      if (res.status === 200) {
        redirect("/dashboard");
      } else {
        const body = await res.json();
        setServerError(body.error);
      }
    }
  }
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
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
                    {errors.email && (
                      <p className="text-sm text-red-500">{errors.email}</p>
                    )}
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
                    {errors.password && (
                      <p className="text-sm text-red-500">{errors.password}</p>
                    )}
                  </div>
                  <div className="grid gap-3">
                    <Button
                      type="button"
                      onClick={_handleClick}
                      className="w-full"
                    >
                      Login
                    </Button>
                    {serverError && (
                      <p className="text-sm text-red-500">{serverError}</p>
                    )}
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
