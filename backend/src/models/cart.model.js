import mongoose, { mongo } from "mongoose";

const cartItemSchema = new mongo.Schema({
    product:{
        type:mongoose.Schema.type.ObjectId,
        ref:"Product",
        required:true,
    },
    quantity:{
        type:Number,
        min:1,
        default:1,
        required:true,
    },
},
);

const cartSchema = new mongoose.Schema({
    user:{
        type:mongoose.Schema.type.ObjectId,
        ref:"User",
        required:true,
    },
    clerkId:{
        type:String,
        required:true,
        unique:true,
    },
    items:[cartItemSchema],
},
    {timestamps:true}
);

export const Cart = mongoose.model("Cart",cartSchema);