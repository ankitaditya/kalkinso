import React, { useEffect, useRef, useState } from 'react';
import {
  Grid,
  Column,
  Tile,
  Button,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  Modal,
  TextInput,
  NumberInput,
  ButtonSet,
} from '@carbon/react';
import { load } from '@cashfreepayments/cashfree-js';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { CheckmarkFilled, CloseFilled, InformationFilled, InformationSquareFilled } from '@carbon/react/icons';

const WalletPage = () => {
  // Sample data
  const [ balance, setBalance ] = useState(null);
  const [ transactions, setTransactions ] = useState([]);

  useEffect(() => {
    if(balance === null) {
      axios.get('/api/payments/wallet/balance', {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      }).then((response) => {
        setBalance(response.data.balance);
      }).catch((error) => {
        console.error('Error fetching wallet balance:', error);
      });
    }
    if(transactions.length === 0) {
        axios.get('/api/payments/orders', {
            headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
        }).then((response) => {
            setTransactions(response.data.orders.reverse());
        }).catch((error) => {
            console.error('Error fetching wallet transactions:', error);
        });
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(null);
  const invoiceRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const [ amount, setAmount ] = useState(0);
  const STATUS_ICONS = {
    PAID: <CheckmarkFilled style={{ color: 'green' }} />,
    PENDING: <InformationFilled style={{ color: 'black' }} />,
    ACTIVE: <InformationSquareFilled style={{ color: 'black' }} />,
    FAILED: <CloseFilled style={{ color: 'red' }} />,
  }

  const printInvoice = () => {
    if (invoiceRef.current) {
      const printContents = invoiceRef.current.innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const openModal = (transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTransaction(null);
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
  };

  const handlePayment = async (option) => {
    try {
      // Fetch the payment session ID from your backend
      let url = option === 'ADD' ? '/api/payments/wallet/top-up' : '/api/payments/wallet/withdraw';
      const response = await axios.post(url, {
        amount: amount,
        description: option === 'ADD' ? 'Wallet Top-up' : 'Wallet Withdrawal',
      },
    {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
    });
      const { paymentSessionId, returnUrl, orderId } = await response.data;

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
      console.error('Error initiating payment:', error);
    }
  };

  return (
    <Grid fullWidth>
        <Column lg={12} md={8} sm={4}>
          <Tile className="transaction-history-tile">
            <h3>Transaction History</h3>
            <TableContainer title="Recent Transactions">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Order Id</TableHeader>
                    <TableHeader>Description</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Amount (₹)</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id} onClick={() => openModal(transaction)} style={{ cursor: 'pointer' }}>
                      <TableCell>{transaction.created_at}</TableCell>
                      <TableCell>{transaction.orderId}</TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{STATUS_ICONS[transaction.paymentStatus]}</TableCell>
                      <TableCell>{transaction.orderId?.startsWith('WITHDRAW') ? `-${transaction.amount}` : (transaction.orderId?.startsWith('TOPUP')?`+${transaction.amount}`:transaction.amount)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="wallet-balance-tile">
            <h3>Your Wallet Balance</h3>
            <h1>₹{balance?.toLocaleString()}</h1>
            <ButtonSet style={{maxWidth:"10vw"}}>
            <Button kind="primary" size="md" onClick={()=>setIsPaymentModalOpen('ADD')}>Add Funds</Button>
            <Button kind="secondary" size="md" onClick={()=>setIsPaymentModalOpen('WITHDRAW')}>Withdraw</Button>
            </ButtonSet>
          </Tile>
        </Column>
        {selectedTransaction && (
          <Modal
            open={isModalOpen}
            modalHeading="Invoice Details"
            primaryButtonText="Print"
            secondaryButtonText="Close"
            onRequestClose={closeModal}
            onRequestSubmit={printInvoice}
          >
            <div ref={invoiceRef}>
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img src="https://www.kalkinso.com/logo-new.png" alt="Company Logo" style={{ width: '100px', height: 'auto' }} />
              <h2>KALKINSO SOFTWARE (OPC) PRIVATE LIMITED  </h2>
              <p>506 Shukl Pure Nanha, Aindha, Pratapgarh, Kunda, Uttar Pradesh, India, 230204</p>
              <p>GSTIN: 09AALCK1714B1ZU</p>
            </div>
            <TextInput
              id="transaction-date"
              labelText="Date"
              value={selectedTransaction.created_at}
              readOnly
            />
            <TextInput
              id="transaction-description"
              labelText="Description"
              value={selectedTransaction.description}
              readOnly
            />
            <NumberInput
              id="transaction-amount"
              label="Amount"
              value={selectedTransaction.amount}
              readOnly
              hideSteppers={true}
            />
            <TextInput
              id="transaction-id"
              labelText="Invoice ID"
              value={selectedTransaction.orderId}
              readOnly
            />
            <div style={{ marginTop: '20px' }}>
              <h4>Tax Details</h4>
              <TextInput
                id="transaction-gst"
                labelText="GST (18%)"
                value={(selectedTransaction.amount * 0.18).toFixed(2)}
                readOnly
              />
              <TextInput
                id="transaction-total"
                labelText="Total Amount"
                value={(selectedTransaction.amount * 1.18).toFixed(2)}
                readOnly
              />
            </div>
            </div>
          </Modal>
        )}
        {isPaymentModalOpen && (
          <Modal
            open={isPaymentModalOpen}
            modalHeading="Add Funds to your wallet"
            primaryButtonText="Proceed"
            secondaryButtonText="Cancel"
            onRequestClose={closePaymentModal}
            onRequestSubmit={()=>handlePayment(isPaymentModalOpen)}
            primaryButtonDisabled={isPaymentModalOpen==='WITHDRAW'?(amount <= 0||amount>balance):amount <= 0}
          >
            <form>
              <div>
                <TextInput
                  id="name"
                  labelText="Name"
                  value={user.first_name + ' ' + user.last_name}
                  readOnly
                />
              </div>
              <div>
                <TextInput
                  id="email"
                  labelText="Email"
                  value={user.email}
                  readOnly
                />
              </div>
              <div>
                <TextInput
                  id="mobile"
                  labelText="Mobile"
                  value={'+91 '+user.mobile}
                  readOnly
                />
              </div>
              <div>
                <NumberInput
                  id="amount"
                  label="Amount"
                  placeholder="Enter amount"
                  min={amount}
                  max={isPaymentModalOpen === 'WITHDRAW' ? balance : 10000000000000000}
                  onChange={(e) => setAmount(e.target.value)}
                  disableWheel={true}
                  hideSteppers={true}
                  allowEmpty={true}
                />
              </div>
            </form>
          </Modal>
        )}
    </Grid>
  );
};

export default WalletPage;
