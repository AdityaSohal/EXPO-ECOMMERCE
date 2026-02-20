import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.type.ObjectId,
        ref:"Product",
        requried:true,
    },
    userId:{
        type: mongoose.Schema.type.ObjectId,
        ref:"User",
        requried:true,
    },
    orderId:{
        type: mongoose.Schema.type.ObjectId,
        ref:"Order",
        requried:true,
    },
    rating:{
        type:Number,
        min:0,
        max:5,
        required:true,
    },
},
    {timestamps:true}
);

export const Review = mongoose.model("Review",reviewSchema);