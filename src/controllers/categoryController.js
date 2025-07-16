const Category = require('../models/Category');

exports.create = async (req, res) => {
  try {
    await Category.create({ name: req.body.name });
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Failed to create category');
  }
};

exports.delete = async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).send('Failed to delete category');
  }
};
