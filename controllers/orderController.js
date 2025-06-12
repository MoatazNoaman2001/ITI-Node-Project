import Order from '../models/order.js';
import Cart from '../models/cart.js';
import Product from '../models/product.js';

export const createOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { shippingAddress, paymentMethod } = req.body;

        const cart = await Cart.findOne({ user: userId }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Cart is empty' });
        }

        let totalAmount = 0;
        const orderItems = cart.items.map(item => {
            totalAmount += item.price * item.quantity;
            return {
                product: item.product._id,
                name: item.product.name,
                quantity: item.quantity,
                price: item.price
            };
        });

        const order = new Order({
            user: userId,
            orderItems,
            shippingAddress,
            paymentMethod,
            totalAmount,
            status: 'pending'
        });

        await order.save();
        await cart.deleteOne();

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: 'Error creating order', error: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ user: userId })
            .sort({ createdAt: -1 })
            .populate('orderItems.product');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching orders', error: error.message });
    }
};

export const getOrderDetails = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user.id;

        const order = await Order.findOne({ _id: orderId, user: userId })
            .populate('orderItems.product');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching order details', error: error.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { orderId, status } = req.params;
        const userId = req.user.id;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.status = status;
        await order.save();

        res.status(200).json({ message: 'Order status updated', order });
    } catch (error) {
        res.status(500).json({ message: 'Error updating order status', error: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {

        const orders = await Order.find()
            .sort({ createdAt: -1 })
            .populate('user', 'name email')
            .populate('orderItems.product');

        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching all orders', error: error.message });
    }
};
