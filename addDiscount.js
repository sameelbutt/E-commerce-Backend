const mongoose = require('mongoose');
const Discount = require('./models/Discount'); // Adjust the path based on your project structure

// Replace with your MongoDB connection string
const mongoURI = 'mongodb+srv://sam:332211@cluster0.8zrhp.mongodb.net/';

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');

    // Create a sample discount with all required fields
    return Discount.create({
      code: 'DISCOUNT10', // Discount code to be used
      type: 'percentage', // Type of discount (percentage or flat)
      value: 10, // Discount value (10% in this case)
      minPurchase: 1, // Minimum purchase amount to use the discount
      maxDiscount: 2, // Maximum discount amount (if applicable)
      expirationDate: new Date('2024-12-31'), // Expiration date of the discount
      usageLimit: 100, // Maximum number of times the discount can be used
      usageCount: 0,
       // Number of times the discount has been used
      isActive: true // Mark the discount as active
    });
  })
  .then(() => {
    console.log('Sample discount added.');
  })
  .catch(err => {
    console.error('Error:', err);
  })
  .finally(() => {
    mongoose.disconnect();
  });
