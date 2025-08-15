import { supabase } from "@/app/api/supabase.config";
import { fetchJSONAPI } from "@/lib/lib";
import { useQuery } from "@tanstack/react-query";

async function getEmpID() {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }
  if (data.user === null) {
    throw new Error("Unauthorized User");
  }

  const res = await fetchJSONAPI(
    "GET",
    `/api/v1/employees/get-id/${data.user.id}`
  );
  const json = await res.json();
  if (!res.ok) {
    throw new Error(json.error);
  }
  if (json.data.length === 0) {
    throw new Error("Unauthorized User");
  }
  const returnData = {
    empID: json.data[0].txEmployeeCode,
    adminStatus: json.data[0].boHasAdminAccess,
  };
  return returnData;
}

export function useEmployeeIDQuery() {
  return useQuery({
    queryKey: ["emp-id"],
    queryFn: getEmpID,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
