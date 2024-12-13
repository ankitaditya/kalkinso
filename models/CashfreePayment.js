const mongoose = require('mongoose');

const CashfreePaymentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  description: {
    type: String,
    required: true,
  },
  paymentSessionId: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    default: 'INR',
  },
  paymentStatus: {
    type: String,
    enum: ['ACTIVE', 'PAID', 'EXPIRED', 'TERMINATED', 'TERMINATION_REQUESTED'],
    default: 'ACTIVE',
  },
  paymentMode: {
    type: String,
  },
  transactionId: {
    type: String,
  },
  paymentTime: {
    type: Date,
  },
  customerDetails: {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
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

CashfreePaymentSchema.pre('save', function (next) {
  this.updated_at = Date.now();
  next();
});

const CashfreePayment = mongoose.model('CashfreePayment', CashfreePaymentSchema);

module.exports = CashfreePayment;
