"use client";

<<<<<<< HEAD
import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
=======
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/ui/form";
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
import { useBankQuery, useCompanyQuery, useReligionQuery, useRoleQuery, useEmploymentQuery } from "../../add/queries";
import { useParams } from "next/dist/client/components/navigation";
import { fetchJSONAPI } from "@/lib/lib";
import { useRouter } from "next/navigation";
import { FormSkeleton } from "@/components/skeletons";
=======
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
>>>>>>> 3dca31a (Add employees admin page (#3))

export default function Page() {
  const { id } = useParams();
  const router = useRouter();
  const editEmployeeForm = useForm({
    resolver: zodResolver(editEmployeeSchema),
    defaultValues: async () => {
      const res = await fetchJSONAPI("GET", `/api/v1/employees/${id}`);
      const json = await res.json();
      if (!res.ok) {
        return;
      }
      return json.data[0];
    },
  });

  async function editEmployee(employeeData: EditEmployeeSchema) {
<<<<<<< HEAD
    const res = await fetchJSONAPI("PUT", `/api/v1/employees/${id}`, employeeData);
=======
    const res = await fetchJSONAPI(
      "PUT",
      `/api/v1/employees/${id}`,
      employeeData
    );
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
    return <FormSkeleton fields={15} />;
  }
  return (
    <div className="">
      <h1 className="font-bold pb-4">Edit Employee</h1>
      <Form {...editEmployeeForm}>
        <form id="employee-form" onSubmit={editEmployeeForm.handleSubmit(submitForm)}>
=======
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
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
                    <QueryCombobox value={field.value as string} onChange={field.onChange} query={religionComboboxQuery} />
=======
                    <QueryCombobox
                      value={field.value as string}
                      onChange={field.onChange}
                      query={religionComboboxQuery}
                    />
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
=======
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
>>>>>>> 3dca31a (Add employees admin page (#3))
              </FormItem>
            )}
          />
          <FormField
            control={editEmployeeForm.control}
            name="inNumOfDeps"
            render={({ field }) => (
              <FormItem className="my-3">
<<<<<<< HEAD
                <FormLabel className="capitalize">Number of Departments :</FormLabel>
=======
                <FormLabel className="capitalize">
                  Number of Departments :
                </FormLabel>
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
                  <QueryCombobox value={field.value as string} onChange={field.onChange} query={roleComboboxQuery} />
=======
                  <QueryCombobox
                    value={field.value as string}
                    onChange={field.onChange}
                    query={roleComboboxQuery}
                  />
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
                  <QueryCombobox value={field.value as string} onChange={field.onChange} query={employmentComboboxQuery} />
=======
                  <QueryCombobox
                    value={field.value as string}
                    onChange={field.onChange}
                    query={employmentComboboxQuery}
                  />
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
                  <QueryCombobox value={field.value as string} onChange={field.onChange} query={companyComboboxQuery} />
=======
                  <QueryCombobox
                    value={field.value as string}
                    onChange={field.onChange}
                    query={companyComboboxQuery}
                  />
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
                  <QueryCombobox value={field.value as string} onChange={field.onChange} query={bankComboboxQuery} />
=======
                  <QueryCombobox
                    value={field.value as string}
                    onChange={field.onChange}
                    query={bankComboboxQuery}
                  />
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
                <FormLabel className="capitalize">Bank Account Number :</FormLabel>
=======
                <FormLabel className="capitalize">
                  Bank Account Number :
                </FormLabel>
>>>>>>> 3dca31a (Add employees admin page (#3))
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
<<<<<<< HEAD
          {editEmployeeForm.formState.errors.root?.message && <p className="text-sm font-medium text-destructive mb-2">{editEmployeeForm.formState.errors.root.message}</p>}
          <Button type="submit" disabled={submitQuery.isPending}>
            {submitQuery.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Edit Employee"}
=======
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
>>>>>>> 3dca31a (Add employees admin page (#3))
          </Button>
        </form>
      </Form>
    </div>
  );
}
