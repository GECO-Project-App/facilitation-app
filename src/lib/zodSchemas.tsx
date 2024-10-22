import {z} from 'zod';

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;

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

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string(),
  confirmPassword: z.string(),
  firstName: z.string(),
  lastName: z.string(),
});
