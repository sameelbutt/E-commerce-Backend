let express = require('express');
const inventoryController = require('../controllers/inventery');
let router = express.Router();

router.put('/update-stock', inventoryController.updateStock);
router.get('/stock/:id', inventoryController.getProductStock);

module.exports = router;
