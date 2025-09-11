import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

async function _createClient(URL?: string, KEY?: string) {
  const cookieStore = await cookies();
  return createServerClient(URL!, KEY!, {
    db: {
      schema: "dt_vma",
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // TODO : refresh session on middleware
        }
      },
    },
  });
}

export async function createClient() {
  return _createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
}

export async function createServiceRoleClient() {
  return _createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}
