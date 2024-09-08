const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    type: {
        type: String,
        enum: ['percentage', 'flat'],
        required: true
    },
    value: {
        type: Number,
        required: true
    },
    minPurchase: {
        type: Number,
        default: 0
    },
    maxDiscount: {
        type: Number,
        default: null
    },
    expirationDate: {
        type: Date,
        default: null
    },
    usageLimit: {
        type: Number,
        default: null
    },
    usageCount: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

discountSchema.methods.isValid = function() {
    const now = new Date();

    // Check if the discount is active
    if (!this.isActive) return false;

    // Check if the discount has expired
    if (this.expirationDate && this.expirationDate < now) return false;

    // Check if the discount usage limit has been reached
    if (this.usageLimit && this.usageCount >= this.usageLimit) return false;

    return true;
};

const Discount = mongoose.model('Discount', discountSchema);
module.exports = Discount;
