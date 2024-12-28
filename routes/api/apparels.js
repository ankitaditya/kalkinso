const express = require('express');
const { Cashfree } = require('cashfree-pg');
const router = express.Router();
const Orders = require('../../models/Orders'); // Orders schema
const Products = require('../../models/Products'); // Products schema
const User = require('../../models/User');
const auth = require('../../middleware/auth');
const ipAuth = require('../../middleware/ipAuth');
const CashfreePayment = require('../../models/CashfreePayment');
const ADMINS = ['6721232c99a0e2bf67b02ff4', '66a78e7a638c8006d29f7678']

// Initialize Cashfree Payout
Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;
// Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

// Create a new order
router.post('/orders', ipAuth, auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    const { customer, order_items, payment, total_amount } = req.body;
    const order_id = `ORDER_${order_items.map(prod=>`${prod.product_name}|${prod.size}|${prod.color}|${prod.quantity}`).join('\n')}_${req.user.id}_${Date.now()}`;

    const order = new Orders({
      customer: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        mobile: customer.mobile,
        address: customer.address
      },
      order_items,
      payment: {
        ...payment,
        transaction_id: order_id
      },
      total_amount,
      order_status: 'Pending',
    });

    const paymentSession = await Cashfree.PGCreateOrder('2022-09-01', {
      order_id: order_id,
      order_amount: total_amount,
      customer_details: {
        customer_id: req.user.id,
        customer_name: `${user.first_name} ${user.last_name}`,
        customer_email: user.email,
        customer_phone: customer.mobile,
      },
      order_currency: 'INR',
      order_meta: {
        "return_url": `https://www.kalkinso.com/#/orders/${order._id}?token=${req.header('x-auth-token')}`
      }
    });
    const cashfree_payment = new CashfreePayment({
      user: req.user.id,
      orderId: order_id,
      paymentSessionId: paymentSession.data.payment_session_id,
      description: order_items.map(prod=>`${prod.product_name}|${prod.size}|${prod.color}|${prod.quantity}`).join('\n'),
      amount:total_amount,
      customerDetails: { name: `${user.first_name} ${user.last_name}`, email: user.email, phone: customer.mobile },
    });
    await cashfree_payment.save();

    const savedOrder = await order.save();
    res.status(201).json({ order: savedOrder, paymentSessionId: paymentSession.data.payment_session_id, orderId: order_id, returnUrl: `https://www.kalkinso.com/#/orders/${order._id}?token=${req.header('x-auth-token')}` });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
});

// Fetch all orders for the logged-in user
router.get('/orders', ipAuth, auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);
    if(!user){
        res.status(401).json({error: 'unauthorized access'})
    }
    if(ADMINS.includes(req.user.id)){
      let orders = await Orders.find();  
      orders = orders.filter(order=>order.payment.status==="PAID")
      res.status(200).json({ orders });  
    }
    let orders = await Orders.find({ 'customer.email': user.email });
    orders = orders.filter(order=>order.payment.status==="PAID")
    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// Get payment status
router.get('/payment-status/:orderId', ipAuth, auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    let payment = await Orders.findById(orderId);
    const paymentStatus = await Cashfree.PGFetchOrder("2022-09-01", payment.payment.transaction_id)
    if (!payment||!paymentStatus) {
      return res.status(404).json({ error: 'Order not found' });
    }
    payment.payment.status = paymentStatus.data.order_status
    payment.order_status = "Processing"
    const newPayment = await Orders.findOneAndUpdate(
        { _id:orderId }, 
        { ...payment }, 
        { new: true });
    res.status(200).json({ order:newPayment });
  } catch (error) {
    console.error('Error fetching payment status:', error);
    res.status(500).json({ error: 'Failed to fetch payment status' });
  }
});

// Update order status
router.patch('/orders/:orderId/status', ipAuth, auth, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { order_status } = req.body;

    const updatedOrder = await Orders.findByIdAndUpdate(
      orderId,
      { order_status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ order: updatedOrder });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// Fetch order by ID
router.get('/orders/:orderId', ipAuth, auth, async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Orders.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.status(200).json({ order });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});


// Create a new product
router.post('/products', ipAuth, auth, async (req, res) => {
    try {
      const {
        id,
        sku,
        title,
        description,
        availableSizes,
        style,
        price,
        color,
        isLogoTexture,
        isBaseTexture,
        texture,
        installments,
        currencyId,
        currencyFormat,
        isFreeShipping,
        quantity,
      } = req.body;
  
      const product = new Products({
        id,
        sku,
        title,
        description,
        availableSizes,
        style,
        price,
        color,
        isLogoTexture,
        isBaseTexture,
        texture,
        installments,
        currencyId,
        currencyFormat,
        isFreeShipping,
        quantity,
      });
  
      const savedProduct = await product.save();
      res.status(201).json({ product: savedProduct });
    } catch (error) {
      console.error('Error creating product:', error);
      res.status(500).json({ error: 'Failed to create product' });
    }
  });
  
  // Fetch all products
  router.get('/products', async (req, res) => {
    try {
      const products = await Products.find();
      const result = products.filter(product=>product.quantity>0)
      res.status(200).json({ products:result });
    } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).json({ error: 'Failed to fetch products' });
    }
  });
  
  // Fetch a product by ID
  router.get('/products/:productId', async (req, res) => {
    try {
      const { productId } = req.params;
  
      const product = await Products.findOne({ id: productId });
      if (!product) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ product });
    } catch (error) {
      console.error('Error fetching product:', error);
      res.status(500).json({ error: 'Failed to fetch product' });
    }
  });
  
  // Update product details
  router.put('/products/:productId', ipAuth, auth, async (req, res) => {
    try {
      const { productId } = req.params;
  
      const updatedProduct = await Products.findOneAndUpdate(
        { id: productId },
        req.body,
        { new: true }
      );
  
      if (!updatedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ product: updatedProduct });
    } catch (error) {
      console.error('Error updating product:', error);
      res.status(500).json({ error: 'Failed to update product' });
    }
  });
  
  // Delete a product
  router.delete('/products/:productId', ipAuth, auth, async (req, res) => {
    try {
      const { productId } = req.params;
  
      const deletedProduct = await Products.findOneAndDelete({ id: productId });
      if (!deletedProduct) {
        return res.status(404).json({ error: 'Product not found' });
      }
  
      res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
      console.error('Error deleting product:', error);
      res.status(500).json({ error: 'Failed to delete product' });
    }
  });

module.exports = router
  
