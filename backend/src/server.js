import { ENV } from "./configs/env.js";
import { connectDB } from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { functions, inngest } from "./configs/inngest.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import express from "express";

const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/admin",adminRoutes);
app.use("/api/user",userRoutes);
app.use(async (req, res, next) => {
    await connectDB();
    next();
});


app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success" });
});

if (ENV.NODE_ENV !== "production") {
    app.listen(ENV.PORT, () => console.log("Server running on port", ENV.PORT));
}

export default app;