const Cart = require('../models/cartModel');
const Order = require('../models/orderModel');
const Product = require('../models/productModel');
const Discount = require('../models/Discount');
const calculateTotal = require('../utils/calculateTotal');
const stripe = require('stripe')('sk_test_51PfrbuKJMD78Orv2Ot0DiYjooq55JYcF4woH1IbHMx1XgwXXmBIrd1u3BQCF1ybM6DZoAxjMtAHWcCW04bG1ksAE00qLLhKmWm');
const catchasync = require('../utils/catchasync');

exports.processCheckout = catchasync(async (req, res) => {
  const { paymentMethodId, discountCode } = req.body;
  const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');

  if (!cart || cart.items.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  // Fetch product details including price and stock
  const itemsWithDetails = await Promise.all(
    cart.items.map(async item => {
      const product = await Product.findById(item.product);
      if (!product) {
        throw new Error(`Product with ID ${item.product} not found`);
      }
      return {
        product: item.product,
        quantity: item.quantity,
        price: product.price,
        stock: product.stock,
      };
    })
  );

  // Check stock availability and update stock
  for (const item of itemsWithDetails) {
    if (item.stock < item.quantity) {
      return res.status(400).json({ error: `Not enough stock for product ${item.product}` });
    }
    // Update stock
    await Product.findByIdAndUpdate(item.product, { $inc: { stock: -item.quantity } });
  }

  // Calculate total with discount
  const { subtotal, discount, total } = await calculateTotal(itemsWithDetails, discountCode);

  // Create a payment intent with Stripe
  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(total * 100), // Stripe expects amount in cents
    currency: 'pkr',
    payment_method: paymentMethodId,
    confirm: true,
    automatic_payment_methods: {
      enabled: true,
      allow_redirects: 'never',
    },
  });

  // Create an order
  const order = await Order.create({
    user: req.user.id,
    items: itemsWithDetails, // Use itemsWithDetails which includes price and stock
    subtotal: subtotal,
    discount: discount, // Use rounded discount
    total: total, // Use rounded total
    paymentIntentId: paymentIntent.id,
    status: 'paid',
  });
  // Clear the cart
  await Cart.findOneAndUpdate({ user: req.user.id }, { $set: { items: [] } });

  res.status(201).json({ order });
});
