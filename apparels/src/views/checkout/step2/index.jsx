/* eslint-disable react/forbid-prop-types */
/* eslint-disable no-nested-ternary */
import { ArrowLeftOutlined, ArrowRightOutlined, CheckOutlined } from '@ant-design/icons';
import { Boundary } from '@/components/common';
import { CHECKOUT_STEP_1, CHECKOUT_STEP_3 } from '@/constants/routes';
import { Form, Formik } from 'formik';
import { useDocumentTitle, useScrollTop } from '@/hooks';
import PropType from 'prop-types';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { setShippingDetails } from '@/redux/actions/checkoutActions';
import * as Yup from 'yup';
import { StepTracker } from '../components';
import withCheckout from '../hoc/withCheckout';
import ShippingForm from './ShippingForm';
import ShippingTotal from './ShippingTotal';
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';

const FormSchema = Yup.object().shape({
  fullname: Yup.string()
    .required('Full name is required.')
    .min(2, 'Full name must be at least 2 characters long.')
    .max(60, 'Full name must only be less than 60 characters.'),
  email: Yup.string()
    .email('Email is not valid.')
    .required('Email is required.'),
  address: Yup.string()
    .required('Shipping address is required.'),
  mobile: Yup.object()
    .shape({
      country: Yup.string(),
      countryCode: Yup.string(),
      dialCode: Yup.string().required('Mobile number is required'),
      value: Yup.string().required('Mobile number is required')
    })
    .required('Mobile number is required.'),
  isInternational: Yup.boolean(),
  isDone: Yup.boolean()
});

const ShippingDetails = ({ profile, shipping, basket, subtotal }) => {
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
        const config = {
          headers: {
            'Content-Type': 'application/json',
          },
          baseURL: "https://www.kalkinso.com"
        }
        const body = JSON.stringify({ first_name: shipping.fullname.split(' ')[0], last_name: shipping.fullname.split(' ')[1], email: shipping.email, mobile:shipping.mobile, upi:"", adhar: "", terms_conditions:true, password:"", user_role: "Explorer", access: ["ORDERS"] })
        try {
          let res = await axios.post("/api/users", body, config)
          localStorage.setItem('token', res.data.token)
          const auth = await axios.get("/api/auth", {
            headers: {
              ...config.headers,
              "x-auth-token": `${localStorage.getItem('token')}`,
            },
            baseURL: config.baseURL
          })
          localStorage.setItem('user', JSON.stringify(auth.data))
        } catch (err) {
          let res = await axios.post("/api/auth/login/email", {
              email: result.user.email, password: ""
          },{
              headers: {
                ...config.headers,
                "x-auth-token": `${localStorage.getItem('token')}`,
                "x-google-token": `${result._tokenResponse.idToken}`
              },
              baseURL: config.baseURL
            })
            localStorage.setItem('token', res.data.token)
          const auth = await axios.get("/api/auth", {
            headers: {
              ...config.headers,
              "x-auth-token": `${localStorage.getItem('token')}`,
            },
            baseURL: config.baseURL
          })
          localStorage.setItem('user', JSON.stringify(auth.data))
        }
        let url = '/api/apparels/orders';
        console.log(shipping.mobile, typeof shipping.mobile)
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
  useDocumentTitle('Check Out Step 2 | Kalkinso');
  useScrollTop();
  const dispatch = useDispatch();
  const history = useHistory();

  const initFormikValues = {
    fullname: shipping.fullname || profile.fullname || '',
    email: shipping.email || profile.email || '',
    address: shipping.address || profile.address || '',
    mobile: shipping.mobile || profile.mobile || {},
    isInternational: shipping.isInternational || false,
    isDone: shipping.isDone || false
  };

  const onSubmitForm = async (form) => {
    dispatch(setShippingDetails({
      fullname: form.fullname,
      email: form.email,
      address: form.address,
      mobile: form.mobile,
      isInternational: form.isInternational,
      isDone: true
    }));
    await handleCheckout();
  };

  return (
      <div className="checkout">
        <StepTracker current={2} />
        <div className="checkout-step-2">
          <h3 className="text-center">Shipping Details & Checkout</h3>
          <Formik
            initialValues={initFormikValues}
            validateOnChange
            validationSchema={FormSchema}
            onSubmit={onSubmitForm}
          >
            {() => (
              <Form>
                <ShippingForm />
                <br />
                {/*  ---- TOTAL --------- */}
                <ShippingTotal subtotal={subtotal} />
                <br />
                {/*  ----- NEXT/PREV BUTTONS --------- */}
                <div className="checkout-shipping-action">
                  <button
                    className="button button-muted"
                    onClick={() => history.push(CHECKOUT_STEP_1)}
                    type="button"
                  >
                    <ArrowLeftOutlined />
                    &nbsp;
                    Go Back
                  </button>
                  <button
                    className="button button-icon"
                    type="submit"
                  >
                    Confirm
                    &nbsp;
                    <CheckOutlined />
                  </button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
  );
};

ShippingDetails.propTypes = {
  subtotal: PropType.number.isRequired,
  basket: PropType.arrayOf(PropType.object).isRequired,
  profile: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object
  }).isRequired,
  shipping: PropType.shape({
    fullname: PropType.string,
    email: PropType.string,
    address: PropType.string,
    mobile: PropType.object,
    isInternational: PropType.bool,
    isDone: PropType.bool
  }).isRequired
};

export default withCheckout(ShippingDetails);
