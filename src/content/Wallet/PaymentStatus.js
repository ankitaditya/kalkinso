import React, { useEffect, useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  InlineLoading,
} from '@carbon/react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { InformationFilled ,CheckmarkFilled, CloseFilled } from '@carbon/icons-react';
import { useDispatch } from 'react-redux';
import { setLoading } from '../../actions/auth';

const PaymentStatus = () => {
  const { orderId } = useParams();
  const [localLoading, setLocalLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if(orderId && paymentStatus === null) {
      checkPaymentStatus()
    }
  }, []);

  useEffect(() => {
    if(paymentStatus){
        setTimeout(() => {
            dispatch(setLoading(true));
            setTimeout(() => {
                navigate('/wallet');
                window.location.reload();
                dispatch(setLoading(false));
            }, 1000);
        }, 5000);
    }
  }, [paymentStatus]);

  const checkPaymentStatus = async () => {
    setLocalLoading(true);
    setPaymentStatus(null);
    try {
      const response = await axios.get(`/api/payments/payment-status/${orderId}`, 
                                {
                                    headers: {
                                        'Content-Type': 'application/json',
                                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                                    },
                                });
      if (response?.data?.order) {
        setPaymentStatus(response.data.order);
      } else {
        setPaymentStatus({ error: response?.error });
      }
    } catch (error) {
      console.error('Error fetching payment status:', error);
      setPaymentStatus({ error: 'Failed to fetch payment status' });
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <Grid fullWidth>
        <Column lg={16} md={8} sm={4}>
          <Tile className="payment-status-tile" style={{ padding: '2rem', textAlign: 'center' }}>
            <h2 style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {paymentStatus?.error?<CloseFilled style={{ marginRight: '0.5rem', color: "red" }} size={20} />
              :(paymentStatus?.paymentStatus==='Pending'?<InformationFilled size={20} style={{ marginRight: '0.5rem', color: "black" }} />:<CheckmarkFilled size={20} style={{ marginRight: '0.5rem', color: "green" }} />)} Payment Status
            </h2>
            {localLoading && (
              <InlineLoading description="Loading..." />
            )}
            {paymentStatus && (
              <div style={{ marginTop: '20px', marginLeft: 'auto', marginRight: 'auto', maxWidth: '600px', padding: '1rem', backgroundColor: '#f4f4f4', borderRadius: '8px' }}>
                {paymentStatus.error ? (
                  <p style={{ color: 'red', fontWeight: 'bold' }}>{paymentStatus.error}</p>
                ) : (
                  <div style={{ textAlign: 'left' }}>
                    <p><strong>Order ID:</strong> {paymentStatus.orderId}</p>
                    <p><strong>Status:</strong> {paymentStatus.paymentStatus}</p>
                    <p><strong>Description:</strong> {paymentStatus.description}</p>
                    <p><strong>Amount:</strong> ₹{paymentStatus.amount}</p>
                  </div>
                )}
              </div>
            )}
          </Tile>
        </Column>
    </Grid>
  );
};

export default PaymentStatus;
