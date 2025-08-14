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
  return json.data[0].txEmployeeCode;
}

export async function isAdmin(): Promise<boolean> {
  try {
    const empID = await getEmpID();
    console.log("pass");

    const res = await fetchJSONAPI("GET", `/api/v1/employees/${empID}`);
    if (!res.ok) {
      return false;
    }

    const json = await res.json();
    if (json.data === undefined || json.data.length === 0) {
      console.log("empty");
      return false;
    }
    if (json.data[0].boHasAdminAccess) {
      return true;
    }
    console.log("no admun access");
    return false;
  } catch (error) {
    console.log(error);
    return false;
  }
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
