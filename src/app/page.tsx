"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { EyeOffIcon, EyeIcon, Loader2 } from "lucide-react";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchJSONAPI } from "@/lib/lib";
import { useMutation } from "@tanstack/react-query";
import { supabase } from "./api/supabase.config";

const loginSchema = z.object({
  email: z.email("Invalid Email Format").nonempty("Please provide an email"),
  password: z
    .string()
    .nonempty("Please provide a password")
    .min(8, "Password must be at least 8 characters")
    .max(200, "Password must be at most 200 characters"),
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
  const [showPassword, setShowPassword] = useState(false);
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
    const empRes = await fetchJSONAPI(
      "GET",
      `/api/v1/employees/get-id/${data.user.id}`
    );
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
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6")}>
          <Card>
            <CardHeader>
              <CardTitle>Login to your account</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  id="login-form"
                  className="flex flex-col gap-4"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="capitalize">Email</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john.doe@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel className="capitalize">Password</FormLabel>
                        <div className="flex flex-row gap-1 justify-center item-center">
                          <FormControl>
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Type your password here"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            className="size-8"
                            onClick={() => setShowPassword((prev) => !prev)}
                          >
                            {showPassword ? (
                              <EyeIcon className="w-4 h-4" />
                            ) : (
                              <EyeOffIcon className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button form="login-form" type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      "Login"
                    )}
                  </Button>
                  {form.formState.errors.root?.message && (
                    <p className="text-sm font-medium text-destructive">
                      {form.formState.errors.root.message}
                    </p>
                  )}
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
