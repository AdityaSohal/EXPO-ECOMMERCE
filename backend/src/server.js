import express from "express";
import { ENV } from "./configs/env.js";
import { connectDB } from "./configs/db.js";
import { clerkMiddleware } from '@clerk/express';
import { serve } from "inngest/express";
import { functions, inngest } from "./configs/inngest.js";
import adminRoutes from "./routes/admin.routes.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import reviewRoutes from "./routes/review.routes.js";
import productRoutes from "./routes/product.routes.js";
import cartRoutes from "./routes/cart.routes.js";

const app = express();

app.use(express.json());
app.use(clerkMiddleware());
app.use("/api/inngest", serve({ client: inngest, functions }));
app.use("/api/admin",adminRoutes);
app.use("/api/users",userRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/review",reviewRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart",cartRoutes);
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