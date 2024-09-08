let express = require('express');
const orderController = require('../controllers/orderController');
let authcontroller=require('./../controllers/auth')
let router = express.Router();

router.get('/all',authcontroller.protect, orderController.getAllOrders);
router.get('/:id', orderController.getOrderById);
router.put('/:id/status', orderController.updateOrderStatus);
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router;
