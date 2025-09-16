"use client";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import constValues from "@/lib/constants";
import { fetchJSONAPI } from "@/lib/lib";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { supabase } from "@/app/api/supabase.config";
import { z } from "zod";
import { AlertCircle, CheckCircle, ClipboardPlus, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

const categorySchema = z.object({
  txCategoryName: z.string().nonempty("Category name must not empty").max(constValues.maxShortTextLength, "Input too long"),
  txCategoryDescription: z.string().max(constValues.maxTextLength, "Input too long"),
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

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);

  const submitQuery = useMutation({
    mutationKey: ["category-send-mutation"],
    mutationFn: _addCategory,
    onSuccess: () => {
      setShowSuccess(true);
      setShowError(null);
      categoryForm.reset();
      setTimeout(() => {
        setShowSuccess(false);
        refreshAndRevalidatePage("/dashboard/categories");
      }, 3000);
    },
    onError: (error) => {
      setShowError(error.message || "Failed to add category");
      setShowSuccess(false);
      setTimeout(() => {
        setShowError(null);
      }, 3000);
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

    const res = await fetchJSONAPI("POST", "/api/v1/categories", categoryData);
    if (!res.ok) {
      const json = await res.json();
      throw new Error(json.error);
    }
  }
  return (
    <div className="flex w-full ">
      <div className="w-full max-w-sm">
        <h1 className="font-bold mb-4">Add Category</h1>
        <Form {...categoryForm}>
          <form id="category-form" onSubmit={categoryForm.handleSubmit(addCategory)} className="flex flex-col justify-center">
            <FormField
              control={categoryForm.control}
              name="txCategoryName"
              render={({ field }) => (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">Category Name :</FormLabel>
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
                  <FormLabel className="capitalize">Description :</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {categoryForm.formState.errors.root?.message && <p className="text-sm font-medium text-destructive mb-2">{categoryForm.formState.errors.root.message}</p>}
            <Button type="submit" className="w-50 ">
              <ClipboardPlus />
              {submitQuery.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Category"}
            </Button>

            {showSuccess && (
              <Alert className="fixed bottom-4 right-4 w-96 z-50 border-[var(--border)] bg-[var(--accent)] text-[var(--foreground)]">
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Category added successfully!</AlertDescription>
              </Alert>
            )}

            {showError && (
              <Alert className="fixed bottom-4 right-4 w-96 z-50 border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--foreground)]" variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to add category. Please try again.</AlertDescription>
              </Alert>
            )}
          </form>
        </Form>
      </div>
    </div>
  );
}
