import z from "zod";

const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 200;

export const emailSchema = z
  .email("Invalid Email Format")
  .nonempty("Please provide an email");

export const passwordSchema = z.string().nonempty("Please provide a password");

export const passwordCreationSchema = z
  .string()
  .nonempty("Please provide a password")
  .min(MIN_PASSWORD_LENGTH, "Password must be at least 8 characters")
  .max(MAX_PASSWORD_LENGTH, "Password must be at most 200 characters")
  .regex(/^(?=.*[a-z]).+$/, "Must contain one lowercase character")
  .regex(/^(?=.*[A-Z]).+$/, "Must contain one uppercase character")
  .regex(/^(?=.*[^a-zA-Z0-9]).+$/, "Must contain one special character");

export const emailFormSchema = z.object({
  email: emailSchema,
});

export const passwordFormSchema = z.object({
  password: passwordCreationSchema,
});

export const loginSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const userCreationSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type EmailFormSchema = z.infer<typeof emailFormSchema>;
export type PasswordFormSchema = z.infer<typeof passwordFormSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type UserCreationSchema = z.infer<typeof userCreationSchema>;
