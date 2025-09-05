"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { fetchJSONAPI } from "@/lib/lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { PasswordFormSchema, passwordFormSchema } from "@/schemas/schema";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const resetPasswordForm = useForm({
    resolver: zodResolver(passwordFormSchema),
    defaultValues: {
      password: "",
    },
  });

  const submitQuery = useMutation({
    mutationKey: ["reset-password-mutation"],
    mutationFn: _resetPassword,
    onSuccess: () => {
      router.replace("/");
    },
    onError: (error) => {
      _setRootError(error.message);
    },
  });

  function _setRootError(msg: string) {
    resetPasswordForm.setError("root", {
      message: msg,
    });
  }

  function resetPassword(resetPasswordData: PasswordFormSchema) {
    submitQuery.mutate(resetPasswordData);
  }

  async function _resetPassword(resetPasswordData: PasswordFormSchema) {
    const res = await fetchJSONAPI(
      "PUT",
      "/api/v1/auth/update-credentials",
      resetPasswordData
    );
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error);
    }
  }
  return (
    <div className="flex w-full h-screen  items-center justify-center align-items-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Reset Password</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...resetPasswordForm}>
              <form
                id="reset-password-form"
                onSubmit={resetPasswordForm.handleSubmit(resetPassword)}
                className="flex flex-col justify-center"
                autoComplete="off"
              >
                <FormField
                  control={resetPasswordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel className="capitalize">Password :</FormLabel>
                      <div className="flex flex-row gap-1 justify-center item-center">
                        <FormControl>
                          <Input
                            autoComplete="new-password"
                            type={showPassword ? "text" : "password"}
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
                {resetPasswordForm.formState.errors.root?.message && (
                  <p className="text-sm font-medium text-destructive mb-2">
                    {resetPasswordForm.formState.errors.root.message}
                  </p>
                )}
                <Button type="submit" className="my-2">
                  {submitQuery.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Reset Password"
                  )}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
