import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
    "userId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    "items": {
        type: [{
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }],
        required: true
    },
    "totalAmount": {
        type: Number,
        required: true
    },
    "createdAt": {
        type: Date,
        default: Date.now
    },
    "updatedAt": {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model.Cart || mongoose.model("Cart" , cartSchema);