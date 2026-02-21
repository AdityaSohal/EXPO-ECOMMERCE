import {Order} from "../models/order.model.js";
import {Product} from "../models/product.model.js";
import {Review} from "../models/review.model.js";

export async function createReview(req, res) {
    try {
        const { productId, orderId, rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({
                message: "Rating must be between 1 and 5",
            });
        }
        const user = req.user;
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        if (order.clerkId !== user.clerkId) {
            return res.status(403).json({
                error: "Not authorized to review this order",
            });
        }
        if (order.status !== "delivered") {
            return res.status(400).json({
                error: "Cannot review an undelivered order",
            });
        }
        const productInOrder = order.orderItems.find(
            (item) => item.product.toString() === productId.toString()
        );
        if (!productInOrder) {
            return res.status(400).json({
                error: "Product not found in this order",
            });
        }
        const existingReview = await Review.findOne({
            productId,
            userId: user._id,
        });
        if (existingReview) {
            return res.status(400).json({
                error: "You have already reviewed this product",
            });
        }
        await Review.create({
            productId,
            userId: user._id,
            orderId,
            rating,
        });
        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce(
            (sum, rev) => sum + rev.rating,
            0
        );
        const averageRating =
            reviews.length > 0 ? totalRating / reviews.length : 0;
        const product = await Product.findById(productId);
        product.averageRating = averageRating;
        product.numReviews = reviews.length;
        await product.save();
        res.status(201).json({
            message: "Review submitted successfully",
        });
    } catch (error) {
        console.error("Error in creating product review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function deleteReview(req, res) {
    try {
        const { reviewId } = req.params;
        const user = req.user;
        const review = await Review.findById(reviewId);
        if (!review) {
            return res.status(404).json({ error: "Review not found" });
        }
        if (review.userId.toString() !== user._id.toString()) {
            return res.status(403).json({
                error: "Not authorized to delete this review",
            });
        }
        const productId = review.productId;
        await review.deleteOne();
        const reviews = await Review.find({ productId });
        const totalRating = reviews.reduce(
            (sum, rev) => sum + rev.rating,
            0
        );
        const averageRating =
            reviews.length > 0 ? totalRating / reviews.length : 0;
        const product = await Product.findById(productId);
        product.averageRating = averageRating;
        product.numReviews = reviews.length;
        await product.save();
        res.status(200).json({
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Error in deleting product review:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}