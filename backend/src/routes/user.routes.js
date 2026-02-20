import { Router } from "express";
import { addAddress, addToWishList, deleteAddress, getAddress, getWishList, removeFromWishList, updateAddress } from "../controllers/user.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = Router();

router.use(protectRoute);
router.post("/addresses",addAddress);
router.get("/addresses",getAddress);
router.put("/addresses/:addressId",updateAddress);
router.delete("/addresses/:addressId",deleteAddress);

router.post("/wishlist",addToWishList);
router.delete("/wishlist/:productId",removeFromWishList);
router.get("/wishlist",getWishList);

export default router;