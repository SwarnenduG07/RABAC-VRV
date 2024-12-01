import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import { userRouter } from "./routes/user";
import { rolesRouter } from "./routes/roles";
import { servicesRouter } from "./routes/services";
dotenv.config()

const app = express();

app.use(cors({
  origin: process.env.ORIGIN || "https://rabac.vercel.app/",  
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/roles", rolesRouter);
app.use("/api/v1/services", servicesRouter);

app.listen(3001, () => {
    console.log("Backend is running on port 3001");
});
