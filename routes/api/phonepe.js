/**
 * routes/phonepe.js
 */

const express = require('express');
const router = express.Router();
const axios = require('axios');
const qs = require('qs'); // For form-urlencoding

// Example: POST /api/phonepe/create-order
router.post('/create-order', async (req, res) => {
  try {
    const { amount, name, email, phone } = req.body;

    // Generate a simple unique order ID
    const id = Math.floor(Math.random() * 1000);
    const user_id = 'GUEST';
    const order_id = `ORDER_${user_id}_${id}_${Date.now()}`;

    // 1) Request an OAuth token from PhonePe
    //    PhonePe likely requires urlencoded form data for client_credentials flow
    const tokenRequestBody = qs.stringify({
      client_id: process.env.PHONEPE_MERCHANT_ID,
      client_version: 1,
      client_secret: process.env.PHONEPE_MERCHANT_KEY,
      grant_type: 'client_credentials',
    });

    const phonepeSession = await axios.post(
      'https://api.phonepe.com/apis/identity-manager/v1/oauth/token',
      tokenRequestBody,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    console.log('PhonePe token response data:', phonepeSession.data);

    if (!phonepeSession.data?.access_token) {
      return res.status(400).json({ error: 'Failed to obtain PhonePe access token' });
    }

    // 2) Use the access token to initiate a payment session
    //    Here, we post JSON data to the PG Checkout API
    const paymentBody = {
      amount,           // e.g., 10000 = 100.00 INR (in paise)
      merchantOrderId: order_id,
      paymentFlow: {
        type: 'PG_CHECKOUT',
        message: 'Buy me a coffee',
        merchantUrls: {
          redirectUrl: 'https://www.kalkinso.com',
        },
      },
      metaInfo: {
        merchantName: 'Kalkinso',
        name,
        email,
        orderNote: 'Payment for Kalkinso services',
        contact: phone,
      },
    };

    const paymentSession = await axios.post(
      'https://api.phonepe.com/apis/pg/checkout/v2/pay',
      paymentBody, // axios will auto-JSON.stringify by default
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `O-Bearer ${phonepeSession.data.access_token}`, 
          // If PhonePe doc says 'Bearer' instead of 'O-Bearer', change it accordingly
        },
      }
    );

    console.log('Payment session response data:', paymentSession.data);

    // 3) Return the payment session details to the client
    res.status(201).json(paymentSession.data);
  } catch (error) {
    console.error('Error creating PhonePe order:', error?.response?.data || error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

module.exports = router;
