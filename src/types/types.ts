import z from "zod"


const signupSchima = z.object({
    email: z.string().email(),
    username: z.string().min(3).max(50),
    password :z.string().min(6).max(30),
    firstname:z.string().min(2).max(30),
    lastname: z.string().min(2).max(30),
})