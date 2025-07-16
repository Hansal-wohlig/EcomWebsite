const Product = require('../models/Product');
const { validationResult } = require('express-validator');

exports.create = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).send('Invalid input');

  const { title, description, price, category, stockQty } = req.body;
  const images = req.files.map(file => file.filename);

  try {
    await Product.create({
      title,
      description,
      price,
      category,
      stockQty,
      images
    });
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Failed to create product');
  }
};

exports.update = async (req, res) => {
  try {
    const { title, description, price, category, stockQty } = req.body;
    const update = { title, description, price, category, stockQty };
    await Product.findByIdAndUpdate(req.params.id, update);
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Failed to update product');
  }
};

exports.remove = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Failed to delete product');
  }
};
