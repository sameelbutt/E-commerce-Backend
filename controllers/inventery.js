// controllers/inventoryController.js
const Product = require('../models/productModel');

exports.updateStock = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    product.stock += quantity;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getProductStock = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json({ stock: product.stock });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};