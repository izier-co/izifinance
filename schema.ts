import { pgTable, serial, text, varchar } from "drizzle-orm/pg-core";

export const reimbursementNotesTable = pgTable('users', {
  id: uuid(),
  fullName: text('full_name'),
  phone: varchar('phone', { length: 256 }),
});