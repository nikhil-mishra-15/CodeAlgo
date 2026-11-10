import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import cookieParser from "cookie-parser";
import userroutes from "./src/routers/userroutes.js"
import probroutes from "./src/routers/probroutes.js"
import connectDB from "./src/config/dbconnection.js"
//import errorhandler from "./middleware/errorhandler.js";

dotenv.config();

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());
app.use(cors({
  origin: "https://codealgo1.nm737813.workers.dev",
  credentials: true
}));


app.use("/api/users",userroutes);
app.use("/api/problems",probroutes);
//app.use(errorhandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, ()=>{
    console.log(`server running on: ${PORT}`);
})
