import { Prisma } from "@prisma/client";
import { Router, Request, Response } from "express";

const db = Prisma

const router = Router();

router.post("/register", (req :Request, res: Response) => {
    
})


export const userRouter = router;