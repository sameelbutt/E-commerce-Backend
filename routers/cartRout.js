let express = require('express');
const cartController = require('../controllers/cartController');
let authcontroller=require('./../controllers/auth')
let router = express.Router();

router.get('/', cartController.getCart);
router.post('/add',authcontroller.protect, cartController.addToCart);
router.put('/update', cartController.updateCartItem);
router.delete('/remove/:productId', cartController.removeFromCart);

module.exports = router;
