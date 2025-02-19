/**
 * routes/phonepe.js
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs'); // For form-urlencoding
const Razorpay = require('razorpay');
const CashfreePayment = require('../../models/CashfreePayment');
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID_LIVE,
  key_secret: process.env.RAZORPAY_SECRET_KEY_LIVE,
});



// Example: POST /api/phonepe/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, name, email, phone } = req.body;

    // Generate a simple unique order ID
    const id = Math.floor(Math.random() * 1000);
    const user_id = 'GUEST';
    const order_id = `ORDER_${user_id}_${id}_${Date.now()}`;

    const options = {
      amount: amount * 100, // Convert amount to paise
      currency: 'INR',
      receipt: order_id,
      notes: {
        merchantName: 'Kalkinso',
        name,
        email,
        orderNote: 'Payment for Kalkinso services',
        contact: phone,
      },
    };

    const order = await razorpay.orders.create(options);

    const payment = new CashfreePayment({
      user: user_id,
      orderId: order_id,
      paymentSessionId: order.id,
      amount,
      customerDetails: { name, email, phone },
    });
    await payment.save();

    // 3) Return the payment session details to the client
    res.status(201).json(order);
  } catch (error) {
    console.error('Error creating PhonePe order:', error?.response?.data || error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Route to serve the success page
router.get('/payment-success', (req, res) => {
  res.sendFile(path.join(__dirname, 'success.html'));
});

// Route to handle payment verification
router.post('/verify-payment', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const secret = razorpay.key_secret;
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  try {
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    if (isValidSignature) {
      // Update the order with payment details
      const order = await CashfreePayment.findOne({ orderId:razorpay_order_id });
      if (order) {
        const newPayment = await CashfreePayment.findOneAndUpdate(
          { orderId: razorpay_order_id }, 
          { paymentStatus: 'PAID' }, 
          { new: true });
      }
      res.status(200).json({ status: 'ok' });
      console.log("Payment verification successful");
    } else {
      res.status(400).json({ status: 'verification_failed' });
      console.log("Payment verification failed");
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: 'error', message: 'Error verifying payment' });
  }
});

module.exports = router;
