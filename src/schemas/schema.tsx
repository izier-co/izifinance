import z from "zod";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 200;

export const emailSchema = z
  .email("Invalid Email Format")
  .nonempty("Please provide an email");

export const passwordSchema = z
  .string()
  .nonempty("Please provide a password")
  .min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters")
  .max(MAX_PASSWORD_LENGTH, "Password must be at most 200 characters");

export type EmailSchema = z.infer<typeof emailSchema>;
export type PasswordSchema = z.infer<typeof passwordSchema>