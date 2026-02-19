// import express from "express";
// import path from "path";
// import { ENV} from "./configs/env.js";

// const app = express();

// const __dirname = path.resolve();

// app.get("/api/health",(req,res)=>{
//     res.status(200).json({message:"Success"});
// });

// if(ENV.NODE_ENV === "production"){
//     app.use(express.static(path.join(__dirname,"../admin/dist")));

//     app.get("/{*any}",(req,res)=>{
//         res.sendFile(path.join(__dirname,"../admin","dist","index.html"));
//     });
// }

// app.listen(ENV.PORT,()=> 
//   console.log("Server is up and running"));









import express from "express";
import { ENV } from "./configs/env.js";
import { connectDB } from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express'

const app = express();
app.use(clerkMiddleware())
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});


if (process.env.NODE_ENV !== "production") {
  app.listen(ENV.PORT, () => console.log("Server running on port", ENV.PORT));
  connectDB();
}

export default app;