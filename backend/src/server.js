import express from "express";
import path from "path";
import { env } from "./configs/env.js";

const app = express();

app.get("/api/health",(req,res)=>{
    res.status(200).json({message:"Success"});
});

app.listen(ENV.PORT,()=> console.log("Server is up and running"));
