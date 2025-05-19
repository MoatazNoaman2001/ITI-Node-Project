const { default: mongoose } = require("mongoose");

const reviewsSchema = new mongoose.Schema({
    "userId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    "productId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    "rating": {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    "comment": {
        type: String,
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
})