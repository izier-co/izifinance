"use client";

import { Form, FormItem, FormLabel, FormControl, FormMessage, FormField } from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { refreshAndRevalidatePage } from "@/lib/server-lib";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { AlertCircle, CheckCircle, Contact, Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { addEmployee, useBankQuery, useCompanyQuery, useEmploymentQuery, useReligionQuery, useRoleQuery } from "./queries";
import { AddEmployeeSchema, addEmployeeSchema } from "./schemas";
import { QueryCombobox } from "../../reimbursements/add/_components/query-combobox";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useState } from "react";

export default function Page() {
  const addEmployeeForm = useForm({
    resolver: zodResolver(addEmployeeSchema),
    defaultValues: {
      txFullName: "",
      daDateOfBirth: "",
      daJoinDate: "",
      txHomeAddress: "",
      txNationalIdNumber: "",
      txReligionCode: "",
      txTaxNumber: "",
      boMarriageStatus: false,
      inNumOfDeps: 0,
      flSalary: 0,
      txRoleCode: "",
      txEmploymentTypeCode: "",
      txCompanyCode: "",
      txPhoneNumber: "",
      txEmailAddress: "",
      txBankTypeCode: "",
      txBankAccountNumber: "",
    },
  });

  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState<string | null>(null);

  const submitQuery = useMutation({
    mutationKey: ["employee-add-mutation"],
    mutationFn: addEmployee,
    onSuccess: () => {
      setShowSuccess(true);
      setShowError(null);
      addEmployeeForm.reset();
      setTimeout(() => {
        setShowSuccess(false);
        refreshAndRevalidatePage("/dashboard/employees");
      }, 3000);
    },
    onError: (error) => {
      setShowError(error.message || "Failed to add employee");
      setShowSuccess(false);
      addEmployeeForm.setError("root", {
        message: error.message,
      });
      setTimeout(() => {
        setShowError(null);
      }, 3000);
    },
  });

  const bankComboboxQuery = useBankQuery();
  const companyComboboxQuery = useCompanyQuery();
  const religionComboboxQuery = useReligionQuery();
  const roleComboboxQuery = useRoleQuery();
  const employmentComboboxQuery = useEmploymentQuery();

  function submitForm(addEmployeeData: AddEmployeeSchema) {
    submitQuery.mutate(addEmployeeData);
  }
  return (
    <div className="">
      <h1 className="font-bold mb-6">Add Employee</h1>
      <Form {...addEmployeeForm}>
        <form id="employee-form" onSubmit={addEmployeeForm.handleSubmit(submitForm)}>
          <FormField
            control={addEmployeeForm.control}
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
            control={addEmployeeForm.control}
            name="daJoinDate"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Join Date :</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
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
            control={addEmployeeForm.control}
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
            control={addEmployeeForm.control}
            name="txNationalIdNumber"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">ID card number :</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
            name="txReligionCode"
            render={({ field }) => {
              return (
                <FormItem className="my-3">
                  <FormLabel className="capitalize">Religion :</FormLabel>
                  <FormControl>
                    <QueryCombobox value={field.value as string} onChange={field.onChange} query={religionComboboxQuery} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          <FormField
            control={addEmployeeForm.control}
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
            control={addEmployeeForm.control}
            name="boMarriageStatus"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Marriage Status :</FormLabel>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
            name="inNumOfDeps"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Number of Departments :</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
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
            control={addEmployeeForm.control}
            name="txRoleCode"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Role :</FormLabel>
                <FormControl>
                  <QueryCombobox value={field.value as string} onChange={field.onChange} query={roleComboboxQuery} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
            name="txEmploymentTypeCode"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Employment Type :</FormLabel>
                <FormControl>
                  <QueryCombobox value={field.value as string} onChange={field.onChange} query={employmentComboboxQuery} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
            name="txCompanyCode"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Company :</FormLabel>
                <FormControl>
                  <QueryCombobox value={field.value as string} onChange={field.onChange} query={companyComboboxQuery} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
            name="txBankTypeCode"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Bank :</FormLabel>
                <FormControl>
                  <QueryCombobox value={field.value as string} onChange={field.onChange} query={bankComboboxQuery} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
            name="txBankAccountNumber"
            render={({ field }) => (
              <FormItem className="my-3">
                <FormLabel className="capitalize">Bank Account Number :</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={addEmployeeForm.control}
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
            control={addEmployeeForm.control}
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
          {addEmployeeForm.formState.errors.root?.message && <p className="text-sm font-medium text-destructive mb-2">{addEmployeeForm.formState.errors.root.message}</p>}
          <Button type="submit" className="w-50" disabled={submitQuery.isPending}>
            <Contact />
            {submitQuery.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add Employee"}
          </Button>

          {showSuccess && (
            <Alert className="fixed bottom-4 right-4 w-96 z-50 border-[var(--border)] bg-[var(--accent)] text-[var(--foreground)]">
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>Employee added successfully!</AlertDescription>
            </Alert>
          )}

          {showError && (
            <Alert className="fixed bottom-4 right-4 w-96 z-50 border-[var(--destructive)] bg-[var(--destructive)]/10 text-[var(--foreground)]" variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>Failed to add employee. Please try again.</AlertDescription>
            </Alert>
          )}
        </form>
      </Form>
    </div>
  );
}
