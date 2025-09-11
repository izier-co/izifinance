"use client";

import { fetchCombobox } from "@/lib/lib";
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
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error);
  }
  return json;
}

export function useCategoryQuery() {
  return useQuery({
    queryKey: ["category-combobox"],
    queryFn: () => {
      return fetchCombobox({
        url: "/api/v1/categories",
        labelProperty: "txCategoryName",
        valueProperty: "txCategoryID",
      });
    },
  });
}
