"use client";

import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";

import { editEmployeeSchema, EditEmployeeSchema } from "./schemas";
import { Checkbox } from "@/components/ui/checkbox";
import { QueryCombobox } from "../../../reimbursements/add/_components/query-combobox";
import {
  useBankQuery,
  useCompanyQuery,
  useReligionQuery,
  useRoleQuery,
  useEmploymentQuery,
} from "../../add/queries";
import { useParams } from "next/dist/client/components/navigation";
import { fetchJSONAPI } from "@/lib/lib";
import { useRouter } from "next/navigation";

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const editEmployeeForm = useForm({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: async () => {
      const res = await fetchJSONAPI("GET", `/api/v1/employees/${id}`);
      const json = await res.json();
      return json.data[0];
    },
  });

  async function editEmployee(employeeData: EditEmployeeSchema) {
    const res = await fetchJSONAPI(
      "PUT",
      `/api/v1/employees/${id}`,
      employeeData
    );
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error);
    }
    return json;
  }

  const submitQuery = useMutation({
    mutationKey: ["employee-edit-mutation"],
    mutationFn: editEmployee,
    onSuccess: () => {
      refreshAndRevalidatePage("/dashboard/employees");
      router.push("/dashboard/employees");
    },
    onError: (error) => {
      editEmployeeForm.setError("root", {
        message: error.message,
      });
    },
  });

  const bankComboboxQuery = useBankQuery();
  const companyComboboxQuery = useCompanyQuery();
  const religionComboboxQuery = useReligionQuery();
  const roleComboboxQuery = useRoleQuery();
  const employmentComboboxQuery = useEmploymentQuery();

  function submitForm(editEmployeeData: EditEmployeeSchema) {
    submitQuery.mutate(editEmployeeData);
  }

  if (editEmployeeForm.formState.isLoading) {
    return <p>Loading...</p>;
  }
  return (
    <div className="">
      <h1>Edit Employee</h1>
      <Form {...editEmployeeForm}>
        <form
          id="employee-form"
          onSubmit={editEmployeeForm.handleSubmit(submitForm)}
        >
          <FormField
            control={editEmployeeForm.control}
            name="txFullName"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Full Name :</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="daDateOfBirth"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Birth Date :</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txHomeAddress"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Address :</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txReligionCode"
            render={({ field }) => {
              return (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">Religion :</FormLabel>
                  <FormControl>
                    <QueryCombobox
                      value={field.value as string}
                      onChange={field.onChange}
                      query={religionComboboxQuery}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txTaxNumber"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Tax Number :</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Controller
            control={editEmployeeForm.control}
            name="boMarriageStatus"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Marriage Status :</FormLabel>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="inNumOfDeps"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">
                  Number of Departments :
                </FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="flSalary"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Salary :</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txRoleCode"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Role :</FormLabel>
                <FormControl>
                  <QueryCombobox
                    value={field.value as string}
                    onChange={field.onChange}
                    query={roleComboboxQuery}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txEmploymentTypeCode"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Employment Type :</FormLabel>
                <FormControl>
                  <QueryCombobox
                    value={field.value as string}
                    onChange={field.onChange}
                    query={employmentComboboxQuery}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txCompanyCode"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Company :</FormLabel>
                <FormControl>
                  <QueryCombobox
                    value={field.value as string}
                    onChange={field.onChange}
                    query={companyComboboxQuery}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txBankTypeCode"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Bank :</FormLabel>
                <FormControl>
                  <QueryCombobox
                    value={field.value as string}
                    onChange={field.onChange}
                    query={bankComboboxQuery}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txBankAccountNumber"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">
                  Bank Account Number :
                </FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txPhoneNumber"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Phone Number :</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="txEmailAddress"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Email Address :</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {editEmployeeForm.formState.errors.root?.message && (
            <p className="text-sm font-medium text-destructive mb-2">
              {editEmployeeForm.formState.errors.root.message}
            </p>
          )}
          <Button type="submit" disabled={submitQuery.isPending}>
            {submitQuery.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Edit Employee"
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
