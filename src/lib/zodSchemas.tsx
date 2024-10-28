import {z} from 'zod';

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type CreateTeamSchema = z.infer<typeof createTeamSchema>;
export type JoinTeamSchema = z.infer<typeof joinTeamSchema>;

export const updatePasswordSchema = z
  .object({
    password: z.string(),
    confirmPassword: z.string(),
  })
  .refine(
    (data: {password: string; confirmPassword: string}) => data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    },
  );

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  // TODO: Add more advanced password validation
  // .min(8, 'Password must be at least 8 characters')
  // .max(50, 'Password must not exceed 50 characters')
  // .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  // .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  // .regex(/[0-9]/, 'Password must contain at least one number')
  // .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
});

export const signupSchema = z
  .object({
    email: z.string().email(),
    password: z.string(),
    confirmPassword: z.string(),
    first_name: z.string(),
    last_name: z.string(),
  })
  .refine(
    (data: {password: string; confirmPassword: string}) => data.password === data.confirmPassword,
    {
      message: "Passwords don't match",
      path: ['confirmPassword'],
    },
  );

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export const profileSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  first_name: z.string(),
  last_name: z.string(),
  username: z.string(),
});

export const createTeamSchema = z.object({
  name: z.string(),
});

export const joinTeamSchema = z.object({
  code: z.string().regex(/^[0-9A-F]{6}$/, {
    message: 'Code must be 6 alphanumeric characters',
  }),
});
