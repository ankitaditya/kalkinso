import React, { useState } from 'react';
import { MDBBtn, MDBCard, MDBCardBody, MDBCardHeader, MDBCheckbox, MDBCol, MDBInput, MDBListGroup, MDBListGroupItem, MDBRow, MDBTextArea, MDBTypography } from 'mdb-react-ui-kit';
import { useCart } from './Cart/cart-context';
import { load } from '@cashfreepayments/cashfree-js';
import {
  auth,
  GoogleAuthProvider,
  signInWithPopup,
} from "./Cart/utils/FirebaseConfig";
import axios from 'axios';

export default function Checkout() {
    const { products, total } = useCart();
    const [ phone, setPhone ] = useState(null)
    const [ address, setAddress ] = useState({})

  
  const handleCheckout = async (address, phone) => {
    if (total.productQuantity > 0 && phone && Object.keys(address).length===5) {
      try {
        // Fetch the payment session ID from your backend
        const auth = JSON.parse(localStorage.getItem('user'))
        let url = '/api/apparels/orders';
        const response = await axios.post(url, {
          total_amount: total.totalPrice,
          customer: {
            "first_name": auth.first_name,
            "last_name": auth.last_name,
            "email": auth.email,
            "mobile": auth.mobile,
            "address": address
          },
          order_items: products.map(prod=>{
            return {
              product_id: prod.id,
              product_name: prod.title,
              size: prod.availableSizes[0],
              color: prod.color,
              quantity: prod.quantity,
              price: prod.price
            }
          }),
          "payment": {
            "method": "Cashfree",
            "status": "Pending",
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
        alert('Error initiating payment');
      }
    } else {
      alert('Fill all the details!');
    }
  };

  const handleGoogleSignIn = async (address, phone) => {
    if(!phone || Object.keys(address).length<5){
        alert("Fill out all details")
        return
    }
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      localStorage.setItem("auth", JSON.stringify(result));
      const config = {
        headers: {
          'Content-Type': 'application/json',
        },
        baseURL: "https://www.kalkinso.com"
      }
      const body = JSON.stringify({ first_name: result.user.displayName.split(' ')[0], last_name: result.user.displayName.split(' ')[1], email: result.user.email, mobile:"", upi:"", adhar: "", terms_conditions:true, password:"", user_role: "Explorer", access: ["ORDERS"] })
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
        await handleCheckout(address, phone)
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
        await handleCheckout(address, phone)
      }
      
    } catch (error) {
      console.error("Google Sign-In Error:", error.message);
    }
  };
  return (
    <div className="mx-auto mt-5" style={{ maxWidth: '900px' }}>
      <MDBRow>
        <MDBCol md="8" className="mb-4">
          <MDBCard className="mb-4">
            <MDBCardHeader className="py-3">
              <MDBTypography tag="h5" className="mb-0">Biling details</MDBTypography>
            </MDBCardHeader>
            <MDBCardBody>
              <form>
                <MDBRow className="mb-4">
                  <MDBCol>
                    <MDBInput label='City' onChange={(e)=>setAddress({...address, city: e.target.value})} type='text' />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label='State' onChange={(e)=>setAddress({...address, state: e.target.value})} type='text' />
                  </MDBCol>
                  <MDBCol>
                    <MDBInput label='ZIP Code' onChange={(e)=>setAddress({...address, zip_code: e.target.value})} type='text' />
                  </MDBCol>
                </MDBRow>

                <MDBInput label='Country' type='text' onChange={(e)=>setAddress({...address, country: e.target.value})} className="mb-4" />
                <MDBInput label='Street' type='text' onChange={(e)=>setAddress({...address, street: e.target.value})} className="mb-4" />
                <MDBInput label='Phone' type='text' onChange={(e)=>setPhone(e.target.value)} className="mb-4" />
                <MDBTextArea label='Additional information' rows={4} className="mb-4" />

                <div className="d-flex justify-content-center">
                  <MDBCheckbox name='flexCheck' value='' id='flexCheckChecked' label='Create an account?' defaultChecked />
                </div>
              </form>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="4" className="mb-4">
          <MDBCard className="mb-4">
            <MDBCardHeader className="py-3">
              <MDBTypography tag="h5" className="mb-0">Summary</MDBTypography>
            </MDBCardHeader>
            <MDBCardBody>
              <MDBListGroup flush>
                {products.map(prod=>{
                    return <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    {prod.title} ({prod.availableSizes.join(', ')})
                    <span>{prod.currencyFormat} {prod.price} x {prod.quantity}</span>
                  </MDBListGroupItem>
                })}
                <MDBListGroupItem className="d-flex justify-content-between align-items-center px-0">
                  Shipping
                  <span>Free</span>
                </MDBListGroupItem>
                <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                  <div>
                    <strong>Total amount</strong>
                    <strong>
                      <p className="mb-0">(including (12%) GST)</p>
                    </strong>
                  </div>
                  <span><strong>{total.currencyFormat} {total.totalPrice+total.totalPrice*0.12}</strong></span>
                </MDBListGroupItem>
              </MDBListGroup>

              <MDBBtn size="lg" block onClick={()=>handleGoogleSignIn(address, phone)}>
                Make purchase
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </div>
  );
}