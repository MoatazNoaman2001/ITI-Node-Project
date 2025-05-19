const router = require('express').Router();
const { auth, restrectTo } = require('../middelwares/auth');
const { 
    createOrder, 
    getUserOrders, 
    getOrderDetails, 
    updateOrderStatus, 
    getAllOrders 
} = require('../controllers/orderController');

router.post('/', auth, createOrder);
router.get('/', auth, getUserOrders);
router.get('/:orderId', auth, getOrderDetails);
router.put('/:orderId/status/:status', auth, restrectTo('admin'), updateOrderStatus);
router.get('/all', auth, restrectTo('admin'), getAllOrders);

module.exports = router;
