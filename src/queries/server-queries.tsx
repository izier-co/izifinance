import { createClient } from "@/app/api/supabase_server.config";
import { fetchJSONAPI } from "@/lib/lib";

export async function getEmpInfo() {
  const supabase = await createClient();
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
    throw new Error("Something went wrong");
  }
  if (json.data.length === 0) {
    throw new Error("");
  }
  const empID = json.data[0].txEmployeeCode;
  const adminRes = await fetchJSONAPI("GET", `/api/v1/employees/${empID}`);
  if (!adminRes.ok) {
    throw new Error("Something went wrong");
  }

  const adminJson = await adminRes.json();
  if (adminJson.data === undefined || adminJson.data.length === 0) {
    throw new Error("No Employee");
  }
  return adminJson.data[0];
}

export async function getUser() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw new Error(error.message);
  }
  return data.user;
}
