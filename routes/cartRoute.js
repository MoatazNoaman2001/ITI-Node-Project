const router = require('express').Router();
const { auth, restrectTo } = require('../middelwares/auth');
const { 
    addToCart, 
    getCart, 
    updateCartItem, 
    removeFromCart, 
    clearCart 
} = require('../controllers/cartController');

router.post('/', auth, addToCart);
router.get('/', auth, getCart);
router.put('/:productId', auth, updateCartItem);
router.delete('/:productId', auth, removeFromCart);
router.delete('/', auth, clearCart);

module.exports = router;
