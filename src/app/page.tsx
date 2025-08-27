"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, Lock, Mail } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJSONAPI } from "@/lib/lib";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "./api/supabase.config";
import { emailSchema, passwordSchema } from "@/schemas/schema";
import Image from "next/image";
import Link from "next/link";

const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function Home() {
  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const router = useRouter();
  const [showPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(loginData: LoginSchema) {
    setLoading(true);
    loginQuery.mutate(loginData);
  }

  async function _onSubmit(loginData: LoginSchema) {
    const { email, password } = loginData;
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }
    if (data.user === null) {
      throw new Error("Unregistered Account");
    }
    const empRes = await fetchJSONAPI("GET", `/api/v1/employees/get-id/${data.user.id}`);
    const json = await empRes.json();

    if (!empRes.ok) {
      throw new Error(json.error || "Something went wrong in our end");
    }
    if (json.data.length === 0) {
      throw new Error("Unregistered account, please contact your adminstrator");
    }
    const res = await fetchJSONAPI("POST", "/api/v1/auth/signin", loginData);

    if (!res.ok) {
      const body = await res.json();
      throw new Error(body.error || "Something went wrong in our end");
    }
  }
  const loginQuery = useMutation({
    mutationKey: ["login-query"],
    mutationFn: _onSubmit,
    onSuccess: () => {
      router.push("/dashboard");
    },
    onError: (error) => {
      setLoading(false);
      form.setError("root", {
        message: error.message,
      });
    },
  });

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-xl xl:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <div className="flex flex-col xl:flex-row items-center gap-16">
            <div className="flex flex-col items-center justify-center md:justify-end w-full md:w-1/3">
              <Image src="/images/logo.jpg" alt="Logo" width={150} height={150} className="xl:w-200  object-contain" />
              <h1 className="font-bold text-2xl xl:text-3xl mt-2">Izifinance</h1>
            </div>
            <div className="w-full xl:w-2/3">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-center">Login to your account</CardTitle>
                </CardHeader>
                <CardContent>
                  <Form {...form}>
                    <form id="login-form" className="flex flex-col gap-4 " onSubmit={form.handleSubmit(onSubmit)}>
                      <div className="flex flex-row items-center gap-2">
                        <Mail className="text-[var(--sidebar-accent-foreground)]" />
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="capitalize not-italic">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <Lock className="text-[var(--sidebar-accent-foreground)]" />
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <FormLabel className="capitalize not-italic">Password</FormLabel>
                              <div className="flex flex-row gap-1 justify-center item-center">
                                <FormControl>
                                  <Input type={showPassword ? "text" : "password"} placeholder="Type your password here" {...field} />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button form="login-form" type="submit" disabled={loading} className="bg-[var(--primarybtn)] text-white hover:bg-[var(--primarybtnhover)]">
                        {loading ? <Loader2 className="w-4 h-4 animate-spin " /> : "Login"}
                      </Button>

                      {form.formState.errors.root?.message && <p className="text-sm font-medium text-destructive">{form.formState.errors.root.message}</p>}
                    </form>
                  </Form>
                </CardContent>
              </Card>
              <Link href="forgotPassword.tsx" className="flex justify-end font-light text-[var(--sidebar-accent-foreground)] hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
