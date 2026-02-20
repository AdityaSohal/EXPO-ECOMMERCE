import mongoose, { mongo, setDriver } from "mongoose";

const shippingAddressSchema = new mongoose.Schema({
    fullName:{
        type:String,
        required:true,
    },
    streetAddress:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    state:{
        type:String,
        required:true,
    },
    zipcode:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
        required:true,
    },
});

const orderItemSchema = new mongoose.Schema({
    product:{
        type: mongoose.Schema.type.ObjectId,
        ref:"Product",
        requried:true,
    },
    name:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true,
        min:0,
    },
    quantity:{
        type:Number,
        required:true,
        min:1,
    },
    image:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["pending","shipped","delivered"],
        default:"pending",
    },
    deliveredAt:{
        type:Date,
    },
    shippedAt:{
        type:Date,
    }
});

const orderSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.type.ObjectId,
        ref:"Product",
        requried:true,
    },
    clerkId:{
        type:String,
        requried:true,
    },
    orderItem:[orderItemSchema],
    shippingAddress:{
        type:shippingAddressSchema,
        required:true,
    },
    paymentResult:{
        id:String,
        status:String,
    },
    totalPrice:{
        type:Number,
        required:true,
        min:0,
    },
},
    {timestamps:true}
);

export const Order = mongoose.model("Order",orderSchema);