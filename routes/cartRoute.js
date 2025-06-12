import express from 'express';
const cartRouter = express.Router();

import { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} from '../controllers/cartController.js';
import { auth } from '../middelwares/auth.js';

cartRouter.post('/', auth, addToCart);
cartRouter.get('/', auth, getCart);
cartRouter.put('/:productId', auth, updateCartItem);
cartRouter.delete('/:productId', auth, removeFromCart);
cartRouter.delete('/', auth, clearCart);

export default cartRouter;
