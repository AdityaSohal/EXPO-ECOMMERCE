import {Product} from "../models/product.model.js";
import {Order} from "../models/order.model.js";
import {Review} from "../models/review.model.js";
import mongoose from "mongoose";

export async function createOrder(req, res) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const user = req.user;
        const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;
        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: "No order items" });
        }
        for (const item of orderItems) {
            const product = await Product.findById(item.product).session(session);
            if (!product) {
                throw new Error(`Product not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for ${product.name}`);
            }
        }
        const order = await Order.create(
            [
                {
                    user: user._id,
                    clerkId: user.clerkId,
                    orderItems,
                    shippingAddress,
                    paymentResult,
                    totalPrice,
                },
            ],
            { session }
        );
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(
                item.product,
                { $inc: { stock: -item.quantity } },
                { session }
            );
        }
        await session.commitTransaction();
        session.endSession();
        res.status(201).json({
            message: "Order created successfully",
            order: order[0],
        });
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        console.error("Error in creating order:", error.message);
        res.status(500).json({
            message: error.message || "Internal server error",
        });
    }
}

export async function getUserOrders(req, res) {
    try {
        const user = req.user;
        const orders = await Order.find({ user: user._id })
            .populate("orderItems.product")
            .sort({ createdAt: -1 });
        const ordersWithReviewStatus = await Promise.all(
            orders.map(async (order) => {
                const review = await Review.findOne({ orderId: order._id });
                return {
                    ...order.toObject(),
                    hasReviewed: !!review,
                };
            })
        );
        res.status(200).json({
            orders: ordersWithReviewStatus,
        });
    } catch (error) {
        console.error("Error in getting user orders:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}