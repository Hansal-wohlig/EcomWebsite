const Category = require('../models/Category');
const Product = require('../models/Product');

exports.dashboard = async (req, res) => {
  try {
    const categories = await Category.find();
    const products = await Product.find().populate('category');
    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      categories,
      products
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).send('Category name is required');

    await Category.create({ name });
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { title, description, price, category, stockQty } = req.body;
    const images = req.files.map(file => file.filename);

    await Product.create({
      title,
      description,
      price,
      category,
      stockQty,
      images,
      isActive: true
    });

    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.redirect('/admin');
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
