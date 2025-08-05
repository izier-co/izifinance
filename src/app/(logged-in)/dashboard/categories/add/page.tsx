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
import constValues from "@/lib/constants";
import { fetchJSONAPI } from "@/lib/lib";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { supabase } from "@/app/api/supabase.config";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

const categorySchema = z.object({
  txCategoryName: z
    .string()
    .nonempty("Category name must not empty")
    .max(constValues.maxShortTextLength, "Input too long"),
  txCategoryDescription: z
    .string()
    .max(constValues.maxTextLength, "Input too long"),
});

type CategorySchema = z.infer<typeof categorySchema>;

export default function Page() {
  const categoryForm = useForm({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      txCategoryName: "",
      txCategoryDescription: "",
    },
  });

  const submitQuery = useMutation({
    mutationKey: ["category-send-mutation"],
    mutationFn: _addCategory,
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard/categories");
      categoryForm.reset();
    },
    onError: (error) => {
      _setRootError(error.message);
    },
  });

  function _setRootError(msg: string) {
    categoryForm.setError("root", {
      message: msg,
    });
  }

  function addCategory(categoryData: CategorySchema) {
    submitQuery.mutate(categoryData);
  }

  async function _addCategory(categoryData: CategorySchema) {
    const { data, error } = await supabase.auth.getUser();

    if (error) {
      _setRootError(error.message);
      return;
    }
    if (data.user === null) {
      _setRootError("Unregistered User");
      return;
    }

    await fetchJSONAPI("POST", "/api/v1/categories", categoryData);
  }
  return (
    <div className="flex  w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Add Category</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...categoryForm}>
              <form
                id="category-form"
                onSubmit={categoryForm.handleSubmit(addCategory)}
                className="flex flex-col justify-center"
              >
                <FormField
                  control={categoryForm.control}
                  name="txCategoryName"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel className="capitalize">
                        Category Name :
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={categoryForm.control}
                  name="txCategoryDescription"
                  render={({ field }) => (
                    <FormItem className="my-3">
                      <FormLabel className="capitalize">
                        Description :
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {categoryForm.formState.errors.root?.message && (
                  <p className="text-sm font-medium text-destructive mb-2">
                    {categoryForm.formState.errors.root.message}
                  </p>
                )}
                <Button type="submit" className="my-2">
                  {categoryForm.formState.isSubmitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Add Category"
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
