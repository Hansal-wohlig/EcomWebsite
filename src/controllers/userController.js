const Order = require('../models/Order');

exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'title images')
      .sort({ createdAt: -1 }); // Most recent first
    
    res.render('public/user-orders', {
      title: 'My Orders',
      orders,
      user: req.user
    });
  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).send('Server Error');
  }
}; 