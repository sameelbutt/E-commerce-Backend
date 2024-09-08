let express = require('express');
let authController = require('../controllers/auth');
let router = express.Router();


router.post('/signup', authController.signup);
router.post('/verify', authController.verifyAccount);
router.post('/login', authController.login);

module.exports = router;
