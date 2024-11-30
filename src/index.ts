import express from "express"
import cors from "cors"
import { userRouter } from "./routes/user";
import { rolesRouter } from "./routes/roles";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user", userRouter);
app.use("api/v1/roles", rolesRouter);


app.listen(3000, () => {
    console.log("Backend is running on port 3000");
    
})
