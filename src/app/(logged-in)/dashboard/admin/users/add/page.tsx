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
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { LoginSchema, loginSchema } from "@/schemas/schema";
import { useState } from "react";

const addUserSchema = loginSchema;
type AddUserSchema = LoginSchema;

export default function Page() {
  const [showPassword, setShowPassword] = useState(false);
  const addUserForm = useForm({
    resolver: zodResolver(addUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const submitQuery = useMutation({
    mutationKey: ["add-user-mutation"],
    mutationFn: _addUser,
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard/admin/users");
      addUserForm.reset();
    },
    onError: (error) => {
      _setRootError(error.message);
    },
  });

  function _setRootError(msg: string) {
    addUserForm.setError("root", {
      message: msg,
    });
  }

  function addUser(newUserData: AddUserSchema) {
    submitQuery.mutate(newUserData);
  }

  async function _addUser(newUserData: AddUserSchema) {
    const res = await fetchJSONAPI("POST", "/api/v1/users", newUserData);
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error);
    }
  }
  return (
    <div className="flex  w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Add Usder</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...addUserForm}>
              <form
                id="add-user-form"
                onSubmit={addUserForm.handleSubmit(addUser)}
                className="flex flex-col justify-center"
                autoComplete="off"
              >
                <FormField
                  control={addUserForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel className="capitalize">Email :</FormLabel>
                      <FormControl>
                        <Input
                          autoComplete="new-email"
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={addUserForm.control}
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
                {addUserForm.formState.errors.root?.message && (
                  <p className="text-sm font-medium text-destructive mb-2">
                    {addUserForm.formState.errors.root.message}
                  </p>
                )}
                <Button type="submit" className="my-2">
                  {submitQuery.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add User"
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
