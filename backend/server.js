
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

import userroutes from "./src/routers/userroutes.js";
import probroutes from "./src/routers/probroutes.js";
import connectDB from "./src/config/dbconnection.js";

dotenv.config();

connectDB();

const app = express();

app.use(cors({
    origin: "https://codealgo1.nm737813.workers.dev",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use("/api/users", userroutes);
app.use("/api/problems", probroutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on: ${PORT}`);
});
