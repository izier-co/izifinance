"use client";

import { ComboboxItem } from "@/components/form-combobox";
import { fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";
import { ReimbursementItemSchema, ReimbursementSchema } from "../schemas";
import { getCookies } from "@/lib/server-lib";

export async function addReimbursement({
  reimbursementData,
  empID,
  items,
}: {
  reimbursementData: ReimbursementSchema;
  empID: string;
  items: ReimbursementItemSchema[];
}) {
  const payload = {
    ...reimbursementData,
    txEmployeeCode: empID,
    reimbursement_items: items,
  };

  const res = await fetch("/api/v1/reimbursements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": crypto.randomUUID(),
      cookie: await getCookies(),
    },
    body: JSON.stringify(payload),
  });
  return await res.json();
}

async function fetchCombobox(fetchParams: {
  url: string;
  labelProperty: string;
  valueProperty: string;
}): Promise<Array<ComboboxItem>> {
  let data: Array<Record<string, string>> = [];
  let pageNum = 1;
  while (true) {
    const searchParams = new URLSearchParams({
      fields: `${fetchParams.labelProperty},${fetchParams.valueProperty}`,
      paginationPage: pageNum.toString(),
    }).toString();
    const urlWithParams = fetchParams.url + "?" + searchParams;
    const res = await fetchJSONAPI("GET", urlWithParams);
    if (res.ok) {
      const json = await res.json();
      data = data.concat(json.data);
      pageNum++;
      if (json.pagination.isLastPage) {
        break;
      }
    } else {
      break;
    }
  }

  return data.map(
    (item: Record<string, string | number>) =>
      ({
        label: item[fetchParams.labelProperty],
        value: item[fetchParams.valueProperty],
      }) as ComboboxItem
  );
}

export function useCategoryQuery() {
  return useQuery({
    queryKey: ["category-combobox"],
    queryFn: () => {
      return fetchCombobox({
        url: "/api/v1/categories",
        labelProperty: "txCategoryName",
        valueProperty: "inCategoryID",
      });
    },
  });
}

export function useBankQuery() {
  return useQuery({
    queryKey: ["bank-combobox"],
    queryFn: () => {
      return fetchCombobox({
        url: "/api/v1/banks",
        labelProperty: "txBankName",
        valueProperty: "inBankTypeCode",
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
        valueProperty: "inCompanyCode",
      });
    },
  });
}
