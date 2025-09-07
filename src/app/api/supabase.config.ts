import { createBrowserClient } from "@supabase/ssr";

const options = {
  db: {
    schema: "dt_vma",
  },
};

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_KEY!,
  options
);
