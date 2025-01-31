import React, { useEffect, useRef, useState } from 'react';
import {
  Grid,
  Row,
  Column,
  Tile,
  Button,
  DataTable,
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
import axios from 'axios';
import { CheckmarkFilled, CloseFilled, InformationFilled, InformationSquareFilled } from '@carbon/react/icons';

const OrdersPage = () => {
  const [ orders, setOrders ] = useState([]);

  useEffect(() => {
    if(orders.length === 0){
      axios.get('/api/apparels/orders', {
          headers: {
          'Content-Type': 'application/json',
          'x-auth-token': `${localStorage.getItem('token')}`,
          },
      }).then((response) => {
          setOrders(response.data.orders.reverse());
      }).catch((error) => {
          console.error('Error fetching orders:', error);
      });
    }
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const invoiceRef = useRef(null);
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

  return (
    <Grid fullWidth>
        <Column lg={12} md={8} sm={4}>
          <Tile className="transaction-history-tile">
            <h3>Order History</h3>
            <TableContainer title="Recent Orders">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>Date</TableHeader>
                    <TableHeader>Order Status</TableHeader>
                    <TableHeader>Address</TableHeader>
                    <TableHeader>Quantity</TableHeader>
                    <TableHeader>Status</TableHeader>
                    <TableHeader>Amount (₹)</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order._id} onClick={() => openModal(order)} style={{ cursor: 'pointer' }}>
                      <TableCell>{order.placed_at}</TableCell>
                      <TableCell>{order.order_status}</TableCell>
                      <TableCell>{Object.values(order.customer.address).join(', ')}</TableCell>
                      <TableCell>{order.order_items.map(prod=>`${prod.product_name}|${prod.size}|${prod.color}|${prod.quantity}`).join('\n')}</TableCell>
                      <TableCell>{STATUS_ICONS[order.payment.status.toLocaleUpperCase()]}</TableCell>
                      <TableCell>{`₹ ${order.total_amount}`}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Tile>
        </Column>
        <Column lg={4} md={4} sm={4}>
          <Tile className="wallet-balance-tile">
            <h3>Total Orders</h3>
            <h1>{orders.length}</h1>
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
              <h2>Kalkinso Software  </h2>
              <p>506 Shukl Pure Nanha, Aindha, Pratapgarh, Kunda, Uttar Pradesh, India, 230204</p>
              <p>GSTIN: 09AALCK1714B1ZU</p>
            </div>
            <TextInput
              id="transaction-date"
              labelText="Date"
              value={selectedTransaction.placed_at}
              readOnly
            />
            <TextInput
              id="transaction-description"
              labelText="Address"
              value={Object.values(selectedTransaction.customer.address).join(', ')}
              readOnly
            />
            <TextInput
              id="transaction-description"
              labelText="Quantity"
              value={selectedTransaction.order_items.map(prod=>`${prod.product_name}|${prod.size}|${prod.color}|${prod.quantity}`).join('\n')}
              readOnly
            />
            <NumberInput
              id="transaction-amount"
              label="Amount"
              value={selectedTransaction.total_amount}
              readOnly
              hideSteppers={true}
            />
            <TextInput
              id="transaction-id"
              labelText="Invoice ID"
              value={selectedTransaction._id}
              readOnly
            />
            <div style={{ marginTop: '20px' }}>
              <h4>Tax Details</h4>
              <TextInput
                id="transaction-gst"
                labelText="GST (18%)"
                value={selectedTransaction.total_amount}
                readOnly
              />
              <TextInput
                id="transaction-total"
                labelText="Total Amount"
                value={selectedTransaction.total_amount}
                readOnly
              />
            </div>
            </div>
          </Modal>
        )}
    </Grid>
  );
};

export default OrdersPage;
