const mongoose = require('mongoose');

const ApparelsOrderSchema = new mongoose.Schema({
  customer: {
    first_name: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    last_name: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address'],
    },
    mobile: {
      type: String,
      required: [true, 'Mobile number is required'],
      match: [/^\d{10}$/, 'Mobile number must be 10 digits'],
    },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zip_code: {
        type: String,
        required: true,
        match: [/^\d{6}$/, 'ZIP code must be 6 digits'],
      },
    },
  },
  order_items: [
    {
      product_id: {
        type: String,
        required: true,
      },
      product_name: { type: String, required: true },
      size: { type: String, required: true, enum: ['S', 'M', 'L', 'XL', 'XXL'] },
      color: { type: String },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
      texture: { type: String, required: true },
      placement: { type: String, required: true }
    },
  ],
  payment: {
    method: {
      type: String,
      required: true,
      enum: ['Credit Card', 'Debit Card', 'Net Banking', 'UPI', 'Cash on Delivery', 'Cashfree'],
    },
    status: {
      type: String,
      required: true,
      enum: ['ACTIVE', 'PAID', 'EXPIRED', 'TERMINATED', 'TERMINATION_REQUESTED'],
      default: 'Pending',
    },
    transaction_id: { type: String },
  },
  order_status: {
    type: String,
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Pending',
  },
  total_amount: {
    type: Number,
    required: true,
    min: 0,
  },
  placed_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updated_at` before saving
ApparelsOrderSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const ApparelsOrder = mongoose.model('ApparelsOrder', ApparelsOrderSchema);

module.exports = ApparelsOrder;
