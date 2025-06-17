import "dotenv/config";
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/db/schema.ts",
  schemaFilter: ["dt_dwh"],
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_POOLER_URL!,
  },
});
