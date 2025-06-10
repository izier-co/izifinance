import { createClient } from "@supabase/supabase-js";

const options = {
  db: {
    schema: "dt_dwh",
  },
};

export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_KEY!,
  options
);
