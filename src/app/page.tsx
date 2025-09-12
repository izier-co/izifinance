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
import { emailFormSchema, EmailFormSchema, emailSchema, passwordSchema } from "@/schemas/schema";
import Image from "next/image";
import { z } from "zod";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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

  const emailForm = useForm<EmailFormSchema>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });

  const router = useRouter();
  const [showPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resetPasswordLoading, setResetPasswordLoading] = useState(false);
  const [open, setOpen] = useState(false);

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
    if (json.data[0].boActive === false || json.data[0].boStatus === false) {
      throw new Error("Deactivated Account, please contact your administrator");
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

  async function sendForgetPassword(data: EmailFormSchema) {
    setResetPasswordLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
      redirectTo: "http://localhost:3000/forgot-password",
    });
    console.log(error);
    setResetPasswordLoading(false);
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md xl:max-w-3xl">
        <div className={cn("flex flex-col gap-6")}>
          <div className="flex flex-col xl:flex-row items-center gap-16">
            <div className="flex flex-col items-center justify-center md:justify-end w-full md:w-1/3">
              <Image src="/images/logolight.jpg" alt="logo light mode" width={150} height={150} className="xl:w-200 object-contain dark:hidden" />
              <Image src="/images/logodark.jpg" alt="logo dark mode" width={150} height={150} className="xl:w-200 object-contain hidden dark:block " />
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
                      <div className="flex flex-row items-center justify-center gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <div className="flex flex-row justify-start items-center gap-2">
                                <Mail className="text-[var(--sidebar-accent-foreground)]" />
                                <FormLabel className="capitalize not-italic">Email</FormLabel>
                              </div>
                              <FormControl>
                                <Input placeholder="john.doe@example.com" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="flex flex-row items-center justify-center gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem className="w-full">
                              <div className="flex flex-row justify-start item-center gap-2">
                                <Lock className="text-[var(--sidebar-accent-foreground)]" />
                                <FormLabel className="capitalize not-italic">Password</FormLabel>
                              </div>
                              <FormControl>
                                <Input type={showPassword ? "text" : "password"} placeholder="Type your password here" {...field} />
                              </FormControl>
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
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <div className="flex justify-end w-full">
                    <button className="font-light text-[var(--sidebar-accent-foreground)] hover:underline">Forgot Password</button>
                  </div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Reset Password</DialogTitle>
                    <DialogDescription>Insert the email of the account to be sent confirmation email for</DialogDescription>
                  </DialogHeader>
                  <Form {...emailForm}>
                    <form id="change-description-form" onSubmit={emailForm.handleSubmit(sendForgetPassword)}>
                      <FormField
                        control={emailForm.control}
                        name="email"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="capitalize">Email :</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <DialogFooter className="my-2">
                        <DialogClose asChild>
                          <Button variant="secondary" type="button">
                            Cancel
                          </Button>
                        </DialogClose>
                        <Button type="submit">{resetPasswordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Submit"}</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
