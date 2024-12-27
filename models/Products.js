const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
  id: {
    type: String,
    required: [true, 'Product ID is required'],
    unique: true,
    trim: true,
  },
  sku: {
    type: String,
    required: [true, 'SKU is required'],
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
  },
  availableSizes: {
    type: [String],
    required: true,
    enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'], // Add more sizes as needed
  },
  style: {
    type: String,
    required: true,
    trim: true,
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be a positive value'],
  },
  color: {
    type: String,
    required: true,
  },
  isLogoTexture: {
    type: Boolean,
    default: false,
  },
  isBaseTexture: {
    type: Boolean,
    default: false,
  },
  texture: {
    type: String,
    default: null,
  },
  installments: {
    type: Number,
    required: true,
    min: [1, 'Installments must be at least 1'],
    default: 1,
  },
  currencyId: {
    type: String,
    required: true,
    default: 'INR',
  },
  currencyFormat: {
    type: String,
    required: true,
    default: '₹',
  },
  isFreeShipping: {
    type: Boolean,
    default: false,
  },
  quantity: {
    type: Number,
    required: true,
    min: [0, 'Quantity must be at least 0'],
    default: 1,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update `updated_at` before saving
ProductSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const Product = mongoose.model('Product', ProductSchema);

module.exports = Product;
