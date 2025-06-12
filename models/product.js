import mongoose from "mongoose";


const productSchema = new mongoose.Schema({
    "name": {
        type: String,
        required: true
    },
    "description": {
        type: String,
        required: true
    },
    "price": {
        type: Number,
        required: true
    },
    "stock": {
        type: Number,
        required: true
    },
    "sellerId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    "photos": {
        type: [String],
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


export default mongoose.model.Product || mongoose.model('Product', productSchema);