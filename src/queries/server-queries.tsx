import { createClient } from "@/app/api/supabase_server.config";
import { fetchJSONAPI } from "@/lib/lib";

export async function getEmpAdminStatus() {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    return false;
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
    return false;
  }
  if (json.data.length === 0) {
    return false;
  }
  const empID = json.data[0].txEmployeeCode;
  const adminRes = await fetchJSONAPI("GET", `/api/v1/employees/${empID}`);
  if (!adminRes.ok) {
    return false;
  }

  const adminJson = await adminRes.json();
  if (adminJson.data === undefined || adminJson.data.length === 0) {
    return false;
  }
  if (adminJson.data[0].boHasAdminAccess) {
    return true;
  }
  return false;
}
