import { CHECKOUT_STEP_1 } from '@/constants/routes';
import { Form, Formik } from 'formik';
import { displayActionMessage } from '@/helpers/utils';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React from 'react';
import { Redirect } from 'react-router-dom';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import CreditPayment from './CreditPayment';
import PayPalPayment from './PayPalPayment';
import Total from './Total';
import axios from 'axios';
import { load } from '@cashfreepayments/cashfree-js';

const FormSchema = Yup.object().shape({
  name: Yup.string()
    .min(4, 'Name should be at least 4 characters.')
    .required('Name is required'),
  cardnumber: Yup.string()
    .min(13, 'Card number should be 13-19 digits long')
    .max(19, 'Card number should only be 13-19 digits long')
    .required('Card number is required.'),
  expiry: Yup.date()
    .required('Credit card expiry is required.'),
  ccv: Yup.string()
    .min(3, 'CCV length should be 3-4 digit')
    .max(4, 'CCV length should only be 3-4 digit')
    .required('CCV is required.'),
  type: Yup.string().required('Please select paymend mode')
});

const Payment = ({ shipping, payment, subtotal, basket }) => {
  const handleCheckout = async () => {
    if (subtotal && shipping) {
      try {
        // Fetch the payment session ID from your backend
        // const auth = JSON.parse(localStorage.getItem('user'))
        // id: PropType.string,
        // name: PropType.string,
        // brand: PropType.string,
        // price: PropType.number,
        // quantity: PropType.number,
        // maxQuantity: PropType.number,
        // description: PropType.string,
        // keywords: PropType.arrayOf(PropType.string),
        // selectedSize: PropType.string,
        // selectedColor: PropType.string,
        // imageCollection: PropType.arrayOf(PropType.string),
        // sizes: PropType.arrayOf(PropType.string),
        // image: PropType.string,
        // imageUrl: PropType.string,
        // isFeatured: PropType.bool,
        // isRecommended: PropType.bool,
        // availableColors: PropType.arrayOf(PropType.string)
        let url = '/api/apparels/orders';
        const response = await axios.post(url, {
          total_amount: subtotal,
          customer: {
            "first_name": shipping.fullname.split(' ')[0],
            "last_name": shipping.fullname.split(' ')[1],
            "email": shipping.email,
            "mobile": shipping.mobile,
            "address": shipping.address
          },
          order_items: basket.map(prod=>{
            return {
              product_id: prod.id,
              product_name: prod.name,
              size: prod.selectedSize,
              color: prod.selectedColor,
              quantity: prod.quantity,
              price: prod.price,
              texture: prod.keywords[0],
              placement: prod.keywords[1]
            }
          }),
          "payment": {
            "method": "Cashfree",
            "status": "ACTIVE",
            "transaction_id": `TXN`
          },
        },
      {
          headers: {
              'Content-Type': 'application/json',
              "x-auth-token": `${localStorage.getItem('token')}`,
          },
          baseURL: "https://www.kalkinso.com"
      });
        
        const { paymentSessionId, returnUrl, orderId, order } = await response.data;
  
        // Load Cashfree SDK
        const cashfree = await load({ mode: 'production' }); // Use 'production' in live environment
  
        // Configure payment options
        const paymentOptions = {
          paymentSessionId,
          returnUrl,
          // Additional options as required
        };
  
        // Trigger the payment
        const result = await cashfree.checkout(paymentOptions);
        if (result.redirect){
          console.log('Redirecting to Cashfree Checkout');
        }
      } catch (error) {
        console.log(error)
        displayActionMessage('Error initiating payment', 'error');
      }
    } else {
      displayActionMessage('Fill all the details!', 'error');
    }
  };
  useDocumentTitle('Check Out Final Step | Kalkinso');
  useScrollTop();

  const initFormikValues = {
    name: payment.name || '',
    cardnumber: payment.cardnumber || '',
    expiry: payment.expiry || '',
    ccv: payment.ccv || '',
    type: payment.type || 'paypal'
  };

  const onConfirm = async () => {
    await handleCheckout();
  };

  if (!shipping || !shipping.isDone) {
    return <Redirect to={CHECKOUT_STEP_1} />;
  }
  return (
    <div className="checkout">
      <StepTracker current={3} />
      <Formik
        initialValues={initFormikValues}
        onSubmit={onConfirm}
      >
        {() => (
          <Form className="checkout-step-3">
            {/* <CreditPayment />
            <PayPalPayment /> */}
            <Total
              isInternational={shipping.isInternational}
              subtotal={subtotal}
            />
          </Form>
        )}
      </Formik>
    </div>
  );
};

Payment.propTypes = {
  shipping: PropType.shape({
    isDone: PropType.bool,
    isInternational: PropType.bool
  }).isRequired,
  payment: PropType.shape({
    name: PropType.string,
    cardnumber: PropType.string,
    expiry: PropType.string,
    ccv: PropType.string,
    type: PropType.string
  }).isRequired,
  basket: PropType.arrayOf(PropType.object).isRequired,
  subtotal: PropType.number.isRequired
};

export default withCheckout(Payment);
