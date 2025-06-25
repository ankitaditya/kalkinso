// src/BuyCoffeePage.js
import React, { useState, useEffect } from 'react';
import {
  Button,
  TextInput,
  NumberInput,
  Checkbox,
} from '@carbon/react';
import './BuyMeCoffee.scss';
import axios from 'axios';

function BuyCoffeePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [cups, setCups] = useState(1);
  const [isRecurring, setIsRecurring] = useState(false);

  // Dynamically load the Razorpay checkout script if not already loaded
  useEffect(() => {
    if (!window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleBuyCoffee = async () => {
    if (!name || !email || !phone) {
      alert('Please fill all the fields');
      return;
    }

    try {
      // Create order by calling your backend endpoint
      const response = await axios.post('/api/phonepe/create-order', {
        amount: cups,
        name,
        email,
        phone,
      });
      const order = response.data;

      // Configure Razorpay options
      const options = {
        key: 'rzp_live_Z3U0AoBZ8N7rSf', // Replace with your Razorpay key_id
        amount: order.amount,
        currency: order.currency,
        name: 'KALKINSO SOFTWARE (OPC) PRIVATE LIMITED',
        description: 'Buy Me A Coffee',
        order_id: order.id, // Order ID from your backend
        callback_url: `${window.location.origin}/#/wallet/${order.id}`, // Your success URL
        prefill: {
          name: name,
          email: email,
          contact: phone,
        },
        theme: {
          color: '#F37254',
        },
        handler: function (response) {
          // Verify the payment by calling your backend
          axios.post('/api/phonepe/verify-payment', {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          })
            .then((res) => {
              if (res.data.status === 'ok') {
                window.location.href = `${window.location.origin}/#/wallet/${order.id}`;
              } else {
                alert('Payment verification failed');
              }
            })
            .catch((error) => {
              console.error('Error verifying payment:', error);
              alert('Error verifying payment');
            });
        },
      };

      // Open Razorpay Checkout
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment initiation failed');
    }
  };

  return (
    <div className="buy-coffee-container">
      <div className="coffee-card">
        <div className="coffee-header">
          <h2>Buy me a Coffee</h2>
        </div>
        <div className="coffee-content">
          <p>
            If you like my work, feel free to show some love by buying me a cup of coffee!
          </p>
        </div>
        <div className="coffee-form">
          <TextInput
            id="name-input"
            labelText="Your Name"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextInput
            id="email-input"
            labelText="Your Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextInput
            id="phone-input"
            labelText="Your Mobile Number"
            placeholder="Enter your mobile number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <NumberInput
            id="cups-input"
            label="Amount"
            min={1}
            value={cups}
            disableWheel={true}
            hideSteppers={true}
            onChange={(event) => setCups(event.target.value)}
          />
        </div>
        <div className="coffee-action">
          <Button kind="primary" size="md" onClick={handleBuyCoffee}>
            Buy Coffee
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BuyCoffeePage;
