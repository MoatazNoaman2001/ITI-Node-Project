const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    "userId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    "products": {
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
    "status": {
        type: String,
        enum: ['pending','processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    "paymentMethod": {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer'],
        required: true
    },
    "paymentStatus": {
        type: String,
        enum: ['paid', 'unpaid'],
        default: 'unpaid'
    },
    "paymentId": {
        type: String,
        default: null
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