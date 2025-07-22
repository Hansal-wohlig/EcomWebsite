const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Cart = require('../models/cartModel');
const Product = require('../models/Product');
const isLoggedIn = require('../middleware/isLoggedIn');

// Create Stripe Checkout Session
router.post('/checkout/create-checkout-session', isLoggedIn, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const line_items = cart.items.map(item => ({
      price_data: {
        currency: 'inr',
        product_data: {
          name: item.product.title,
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects paise
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${req.protocol}://${req.get('host')}/checkout/payment-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.protocol}://${req.get('host')}/cart`,
      customer_email: req.user.email,
    });

    res.json({ id: session.id });
  } catch (err) {
    console.error('Stripe session error:', err);
    res.status(500).json({ error: 'Failed to create Stripe session' });
  }
});

// Payment Success Page
router.get('/checkout/payment-success', isLoggedIn, async (req, res) => {
  try {
    const session_id = req.query.session_id;
    if (!session_id) return res.status(400).send('Missing session ID');

    // Retrieve session to confirm payment
    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status !== 'paid') {
      return res.status(400).send('Payment not completed');
    }

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
    if (!cart || !cart.items.length) {
      return res.render('public/payment-success', { title: 'Payment Success', user: req.user, cart: null });
    }

    // Reduce product stock
    for (const item of cart.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product._id, {
          $inc: { stockQty: -item.quantity }
        });
      }
    }

    // Save order
    const Order = require('../models/Order');
    const orderProducts = cart.items.map(item => ({
      product: item.product._id,
      name: item.product.title,
      price: item.price,
      quantity: item.quantity
    }));
    const total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    await Order.create({
      user: req.user._id,
      products: orderProducts,
      total
    });

    // Clear cart
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.render('public/payment-success', { title: 'Payment Success', user: req.user, cart });
  } catch (err) {
    console.error('Payment success error:', err);
    res.status(500).send('Payment processing failed');
  }
});

module.exports = router;
