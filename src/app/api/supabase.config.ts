import { createBrowserClient } from "@supabase/ssr";
// import { createClient } from "@supabase/supabase-js";

const options = {
  db: {
    schema: "dt_dwh",
  },
};

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!,
  options
);
