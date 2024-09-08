let express = require('express');
const checkoutController = require('../controllers/checkout');
let authcontroller=require('./../controllers/auth')
let router = express.Router();

router.post('/process', authcontroller.protect, checkoutController.processCheckout);

module.exports = router;
