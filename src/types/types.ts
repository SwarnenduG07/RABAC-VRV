import z from "zod"


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
});

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

