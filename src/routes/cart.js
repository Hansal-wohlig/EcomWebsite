const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const isLoggedIn = require('../middleware/isLoggedIn');

// Render cart page
router.get('/cart', isLoggedIn, cartController.getCart);

// REST API for cart
router.get('/api/cart', isLoggedIn, cartController.getCartData);
router.post('/api/cart', isLoggedIn, cartController.addToCart);
router.post('/api/cart/remove-one', isLoggedIn, cartController.removeOneFromCart);
router.post('/api/cart/remove-all', isLoggedIn, cartController.removeFromCart);
router.delete('/api/cart/clear', isLoggedIn, cartController.clearCart);

module.exports = router;
