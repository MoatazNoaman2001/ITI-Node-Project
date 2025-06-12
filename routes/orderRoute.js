import express from 'express';
const orderRouter = express.Router();
import { 
    createOrder, 
    getUserOrders, 
    getOrderDetails, 
    updateOrderStatus, 
    getAllOrders 
} from '../controllers/orderController.js';
import { auth, restrectTo } from '../middelwares/auth.js';

orderRouter.post('/', auth, createOrder);
orderRouter.get('/', auth, getUserOrders);
orderRouter.get('/:orderId', auth, getOrderDetails);
orderRouter.put('/:orderId/status/:status', auth, restrectTo('seller'), updateOrderStatus);
orderRouter.get('/all', auth, restrectTo('seller'), getAllOrders);

export default orderRouter;
