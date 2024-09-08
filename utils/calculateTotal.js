const Product = require('../models/productModel');
const Discount = require('../models/Discount');

async function calculateTotal(cartItems, discountCode) {
  let total = 0;
  let discount = 0;

  // Calculate subtotal
  for (const item of cartItems) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  console.log('Cart total before discount:', total);

  if (discountCode) {
    const discountObj = await Discount.findOne({ code: discountCode });
    console.log('Discount object:', discountObj);

    if (discountObj && discountObj.isValid()) {
      if (discountObj.type === 'percentage') {
        discount = total * (discountObj.value / 100);
      } else if (discountObj.type === 'flat') {
        discount = discountObj.value;
      }
    }
  }

  console.log('Discount applied:', discount);

  const subtotal = total;
  total -= discount;

  // Round values to two decimal places
  total = parseFloat(total.toFixed(2));
  discount = parseFloat(discount.toFixed(2));

  console.log('Total after discount:', total);

  return { subtotal, discount, total };
}

module.exports = calculateTotal;