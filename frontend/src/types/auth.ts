import z, { email } from "zod";

export const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(1, "Password must be not empty"),
});

export const signupSchema = z
  .object({
    username: z
      .string()
      .min(2, "Username must be at least 2 characters long")
      .refine((s) => !s.includes(" "), "Username cannot have spaces."),
    email: z.email("Please enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string().min(8, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

export type loginSchemaType = z.infer<typeof loginSchema>;
export type signupSchemaType = z.infer<typeof signupSchema>;
