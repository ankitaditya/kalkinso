// src/BuyCoffeePage.js
import React, { useState } from 'react';
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

  const handleBuyCoffee = () => {
    if (!name || !email || !phone) {
      alert('Please fill all the fields');
      return;
    }
    axios.post('/api/phonepe/create-order', {
        amount: cups,
        name,
        email,
        phone
    }).then((response) => {
        window.location.href = response.data.redirectUrl;
    });
    // Here you'd integrate your payment logic, e.g., call a backend or payment gateway
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
              id="name-input"
              labelText="Your Email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextInput
              id="name-input"
              labelText="Your Mobile Number"
              placeholder="Enter your email"
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
              onChange={(event, { value }) => setCups(value)}
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
