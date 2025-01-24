import {z} from 'zod';

export type UpdatePasswordSchema = z.infer<typeof updatePasswordSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
export type SignupSchema = z.infer<typeof signupSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
export type ProfileSchema = z.infer<typeof profileSchema>;
export type CreateTeamSchema = z.infer<typeof createTeamSchema>;
export type TutorialToMeSchema = z.infer<typeof tutorialToMeSchema>;
export type TeamCodeSchema = z.infer<typeof teamCodeSchema>;
export type MemberSchema = z.infer<typeof memberSchema>;
export type UpdateTeamSchema = z.infer<typeof updateTeamSchema>;
export type InviteTeamMemberSchema = z.infer<typeof inviteTeamMemberSchema>;
export type SSCBrainstormSchema = z.infer<typeof sscBrainstormSchema>;
export type TTMExercisesSchema = z.infer<typeof ttmSchema>;

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
  first_name: z.string(),
  last_name: z.string(),
});

export const memberSchema = z.object({
  profile_name: z.string(),
  role: z.enum(['member', 'facilitator']),
  description: z.string().max(480).nullable(),
});

export const createTeamSchema = z.object({
  name: z.string().min(4),
});

export const teamCodeSchema = z.object({
  code: z.string().regex(/^[0-9A-F]{6}$/, {
    message: 'Code must be 6 alphanumeric characters',
  }),
});

export const updateTeamSchema = z.object({
  name: z.string().min(4),
  delete: z.boolean(),
});

export const tutorialToMeSchema = z.object({
  team_id: z.string(),
  writing_date: z.string(),
  writing_time: z.string(),
  reviewing_date: z.string(),
  reviewing_time: z.string(),
  strengths: z.string().optional(),
  weaknesses: z.string().optional(),
  communications: z.string().optional(),
});

export const inviteTeamMemberSchema = z.object({
  teamId: z.string().uuid(),
  email: z.string().email(),
  language: z.string().optional(),
});

export const sscBrainstormSchema = z.object({
  start: z.object({
    value: z.string().max(480).default(''),
    vote: z.object({
      yes: z.number().default(0),
      no: z.number().default(0),
    }),
  }),
  stop: z.object({
    value: z.string().max(480).default(''),
    vote: z.object({
      yes: z.number().default(0),
      no: z.number().default(0),
    }),
  }),
  continue: z.object({
    value: z.string().max(480).default(''),
    vote: z.object({
      yes: z.number().default(0),
      no: z.number().default(0),
    }),
  }),
});

export const ttmSchema = z.object({
  strengths: z.object({
    value: z.string().max(480).default(''),
    vote: z.object({
      yes: z.number().default(0),
      no: z.number().default(0),
    }),
  }),
  weaknesses: z.object({
    value: z.string().max(480).default(''),
    vote: z.object({
      yes: z.number().default(0),
      no: z.number().default(0),
    }),
  }),
  communication: z.object({
    value: z.string().max(480).default(''),
    vote: z.object({
      yes: z.number().default(0),
      no: z.number().default(0),
    }),
  }),
});
