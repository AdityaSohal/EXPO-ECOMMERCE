import { Router } from "express";
import {
    createProduct,
    getAllCustomers,
    getAllOrders,
    getAllProducts,
    getDashboardStats,
    updateOrderStatus,
    updateProducts,
    deleteProduct,          // ← was missing
} from "../controllers/admin.controller.js";
import { adminOnly, protectRoute } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";

const router = Router();

router.use(protectRoute, adminOnly);
router.post("/products", upload.array("images", 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array("images", 3), updateProducts);
router.delete("/products/:id", deleteProduct);          // ← was missing entirely
router.get("/orders", getAllOrders);
router.patch("/orders/:orderId/status", updateOrderStatus); // ← was "/order/" (typo)
router.get("/customers", getAllCustomers);
router.get("/stats", getDashboardStats);

export default router;