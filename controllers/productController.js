const Product = require("../models/product");

const GetAllProducts = async (req, res) => {
    const { page = 1, limit = 10, name ='', isAsc = false } = req.query;
    const sort = isAsc ? 1 : -1;
    const products = await Product.find({ name: { $regex: name, $options: 'i' } })
        .sort({ createdAt: sort })
        .skip((page - 1) * limit)
        .limit(limit);
    const total = await Product.countDocuments({ name: { $regex: name, $options: 'i' } });
    res.status(200).json({
        success: true,
        message: "Products fetched successfully",
        data: products,
        total,
        page,
        limit
    });
};


const GetProductById = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findById(id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
};

const StoreProduct = async (req, res) => {
    const { name, description, price, stock, sellerId, photos } = req.body;
    const product = new Product({
        name,
        description,
        price,
        stock,
        sellerId,
        photos
    });
    await product.save();
    res.status(201).json({
        success: true,
        message: "Product created successfully",
        data: product
    });
}

const UpdateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, description, price, stock, sellerId, photos } = req.body;
    const product = await Product.findByIdAndUpdate(id, {
        name,
        description,
        price,
        stock,
        sellerId,
        photos
    }, { new: true });
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        data: product
    });
}
const DeleteProduct = async (req, res) => {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
        return res.status(404).json({
            success: false,
            message: "Product not found"
        });
    }
    res.status(200).json({
        success: true,
        message: "Product deleted successfully",
        data: product
    });
}
const SearchProduct = async (req, res) => {
    const { name } = req.query;
    const products = await Product.find({ name: { $regex: name, $options: 'i' } });
    if (products.length === 0) {
        return res.status(404).json({
            success: false,
            message: "No products found"
        });
    }
}
module.exports = {
    GetAllProducts,
    GetProductById,
    StoreProduct,
    UpdateProduct,
    DeleteProduct,
    SearchProduct
}