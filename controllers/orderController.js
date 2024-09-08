// controllers/orderController.js
const Order = require('../models/orderModel');
const stripe = require('./../stripe');

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).populate('items.product');
    console.log('Orders:', orders); // Debug line
    res.json(orders);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id }).populate('items.product');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user.id });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.status !== 'pending' && order.status !== 'paid') {
      return res.status(400).json({ error: 'Order cannot be cancelled' });
    }

    if (order.paymentIntentId) {
      await stripe.refunds.create({ payment_intent: order.paymentIntentId });
    }

    order.status = 'cancelled';
    await order.save();

    res.json(order);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};