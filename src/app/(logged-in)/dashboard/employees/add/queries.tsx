import { fetchCombobox, fetchJSONAPI } from "@/lib/lib";
import { AddEmployeeSchema } from "./schemas";
import { useQuery } from "@tanstack/react-query";

export async function addEmployee(employee: AddEmployeeSchema) {
  const res = await fetchJSONAPI("POST", "/api/v1/employees", employee);
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error);
  }
  return json;
}

export function useBankQuery() {
  return useQuery({
    queryKey: ["bank-combobox"],
    queryFn: () => {
      return fetchCombobox({
        url: "/api/v1/banks",
        labelProperty: "txBankName",
        valueProperty: "txBankTypeCode",
      });
    },
  });
}

export function useCompanyQuery() {
  return useQuery({
    queryKey: ["company-combobox"],
    queryFn: () => {
      return fetchCombobox({
        url: "/api/v1/companies",
        labelProperty: "txCompanyName",
        valueProperty: "txCompanyTypeCode",
      });
    },
  });
}

export function useReligionQuery() {
  return useQuery({
    queryKey: ["religion-combobox"],
    queryFn: () => {
      return fetchCombobox({
        url: "/api/v1/religions",
        labelProperty: "txReligionName",
        valueProperty: "txReligionCode",
      });
    },
  });
}

export function useRoleQuery() {
  return useQuery({
    queryKey: ["role-combobox"],
    queryFn: () => {
      return fetchCombobox({
        url: "/api/v1/roles",
        labelProperty: "txLongRoleName",
        valueProperty: "txRoleCode",
      });
    },
  });
}
export function useEmploymentQuery() {
  return useQuery({
    queryKey: ["employment-combobox"],
    queryFn: () => {
      return fetchCombobox({
        url: "/api/v1/employments",
        labelProperty: "txEmploymentTypeName",
        valueProperty: "txEmploymentTypeCode",
      });
    },
  });
}
