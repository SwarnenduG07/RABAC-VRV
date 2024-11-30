import z from "zod"

// Add new permission types
export enum Permission {
  READ_USERS = 'READ_USERS',
  WRITE_USERS = 'WRITE_USERS',
  DELETE_USERS = 'DELETE_USERS',
  MANAGE_ROLES = 'MANAGE_ROLES',
  ACCESS_ADMIN_PANEL = 'ACCESS_ADMIN_PANEL',
  ACCESS_MODERATOR_PANEL = 'ACCESS_MODERATOR_PANEL',
  // Add more permissions as needed
}

// Define role-permission mappings
export const RolePermissions = {
  ADMIN: [
    Permission.READ_USERS,
    Permission.WRITE_USERS,
    Permission.DELETE_USERS,
    Permission.MANAGE_ROLES,
    Permission.ACCESS_ADMIN_PANEL,
    Permission.ACCESS_MODERATOR_PANEL,
  ],
  MODERATOR: [
    Permission.READ_USERS,
    Permission.ACCESS_MODERATOR_PANEL,
  ],
  USER: [
    Permission.READ_USERS,
  ],
} as const;

export const signupSchima = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password: z.string()
        .min(6)
        .max(30)
        .regex(
            /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])/,
            'Password must contain at least one uppercase letter, one number, and one special character'
        ),
    firstname: z.string().min(2).max(30),
    lastname: z.string().min(2).max(30),
    role: z.enum(['USER', 'MODERATOR', 'ADMIN']).optional(),
});

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

