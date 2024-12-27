const { Cashfree } = require('cashfree-pg');
const express = require('express');
const router = express.Router();
const CashfreePayment = require('../../models/CashfreePayment');
const ipAuth = require('../../middleware/ipAuth');
const auth = require('../../middleware/auth');
const User = require('../../models/User');

// Initialize Cashfree Payout
Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;

// Create an order and initiate payment
router.post('/create-order', ipAuth, auth, async (req, res) => {
  try {
    const { amount, name, email, phone, id } = req.body;
    const user_id = req.user.id;
    const order_id = `ORDER_${user_id}_${id}_${Date.now()}`;

    const paymentSession = await Cashfree.PGCreateOrder('2022-09-01', {
      order_id,
      order_amount: amount,
      customer_details: {
        customer_id: user_id,
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
      },
      order_currency: 'INR',
      order_meta: {
        "return_url": `${req.header('referer')}/#/wallet/${order_id}`
      }
    });
    const payment = new CashfreePayment({
      user: user_id,
      orderId: order_id,
      paymentSessionId: paymentSession.data.payment_session_id,
      amount,
      customerDetails: { name, email, phone },
    });
    await payment.save();


    res.status(201).json({ paymentSessionId: paymentSession.data.payment_session_id, orderId: order_id, returnUrl: `${req.header('referer')}/#/wallet/${order_id}` });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

router.get('/orders', ipAuth, auth, async (req, res) => {
    try {
        const orders = await CashfreePayment.find({ user: req.user.id });
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// Handle payment callback
router.post('/payment-callback', ipAuth, auth, async (req, res) => {
  try {
    const { orderId, referenceId, txStatus, paymentMode, paymentTime } = req.body;
    const payment = await CashfreePayment.findOne({ orderId });

    if (!payment) {
      return res.status(404).json({ error: 'Order not found' });
    }

    payment.paymentStatus = txStatus;
    payment.paymentMode = paymentMode;
    payment.transactionId = referenceId;
    payment.paymentTime = new Date(paymentTime);
    await payment.save();

    res.status(200).json({ message: 'Payment status updated' });
  } catch (error) {
    console.error('Error handling payment callback:', error);
    res.status(500).json({ error: 'Failed to handle payment callback' });
  }
});

// Get payment status
router.get('/payment-status/:orderId', ipAuth, auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const payment = await CashfreePayment.findOne({ orderId });
    const paymentStatus = await Cashfree.PGFetchOrder("2022-09-01", orderId)
    if (!payment||!paymentStatus) {
      return res.status(404).json({ error: 'Order not found' });
    }
    const newPayment = await CashfreePayment.findOneAndUpdate(
        { orderId }, 
        { paymentStatus: paymentStatus.data.order_status }, 
        { new: true });
    res.status(200).json({ order:newPayment });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// Initiate wallet top-up
router.post('/wallet/top-up', ipAuth, auth, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user.id;
    const user = await User.findById(userId);
    const orderId = `TOPUP_${Date.now()}`;

    const paymentSession = await Cashfree.PGCreateOrder('2022-09-01', {
      order_id: orderId,
      order_amount: amount,
      order_note: description,
      customer_details: {
        customer_id: userId,
        customer_name: user.first_name + ' ' + user.last_name,
        customer_email: user.email,
        customer_phone: user.mobile,
      },
      order_currency: 'INR',
      order_meta: {
        "return_url": `${req.header('referer')}/#/wallet/${orderId}`
      }
    });

    const payment = new CashfreePayment({
      user: userId,
      orderId,
      paymentSessionId: paymentSession.data.payment_session_id,
      description,
      amount,
      customerDetails: { name: user.first_name + ' ' + user.last_name, email: user.email, phone: user.mobile },
    });
    await payment.save();

    res.status(201).json({ paymentSessionId: paymentSession.data.payment_session_id, orderId: orderId, returnUrl: `${req.header('referer')}/#/wallet/${orderId}` });
  } catch (error) {
    console.error('Error initiating wallet top-up:', error);
    res.status(500).json({ error: 'Failed to initiate wallet top-up' });
  }
});

// Withdraw from wallet
router.post('/wallet/withdraw', ipAuth, auth, async (req, res) => {
  try {
    const { amount, description } = req.body;
    const userId = req.user.id;
    const orderId = `WITHDRAW_${Date.now()}`;
    const user = await User.findById(userId);

    const userBalance = await getUserWalletBalance(userId);
    if (userBalance < amount) {
      return res.status(400).json({ error: 'Insufficient wallet balance' });
    }

    const paymentSession = await Cashfree.PGCreateOrder('2022-09-01', {
      order_id: orderId,
      order_amount: amount,
      order_note: description,
      customer_details: {
        customer_id: userId,
        customer_name: user.first_name + ' ' + user.last_name,
        customer_email: user.email,
        customer_phone: user.mobile,
      },
      order_currency: 'INR',
      order_meta: {
        "return_url": `${req.header('referer')}/#/wallet/${orderId}`
      }
    });

    const payment = new CashfreePayment({
      user: userId,
      orderId,
      paymentSessionId: paymentSession.data.payment_session_id,
      description,
      amount,
      customerDetails: { name: user.first_name + ' ' + user.last_name, email: user.email, phone: user.mobile },
    });
    await payment.save();

    res.status(201).json({ paymentSessionId: paymentSession.data.payment_session_id, orderId: orderId, redirectUrl: `${req.header('referer')}/#/wallet/${orderId}` });
  } catch (error) {
    console.error('Error initiating withdrawal:', error);
    res.status(500).json({ error: 'Failed to initiate withdrawal' });
  }
});

// Get user's wallet balance
router.get('/wallet/balance', ipAuth, auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const userBalance = await getUserWalletBalance(userId);
    res.status(200).json({ balance: userBalance });
  } catch (error) {
    console.error('Error fetching wallet balance:', error);
    res.status(500).json({ error: 'Failed to fetch wallet balance' });
  }
});

// Helper function to get user's wallet balance
async function getUserWalletBalance(userId) {
  const payments = await CashfreePayment.find({ user: userId });
  let balance = 0;
  payments.forEach((payment) => {
    if (payment.paymentStatus === 'PAID') {
      if (payment.orderId.startsWith('TOPUP')) {
        balance += payment.amount;
      } else if (payment.orderId.startsWith('WITHDRAW')) {
        balance -= payment.amount;
      }
    }
  });

  return balance;
}

module.exports = router;
