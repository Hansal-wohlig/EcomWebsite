// seedCategories.js
require('dotenv').config()
const mongoose = require('mongoose')
const Category = require('./src/models/Category')
const connectDB = require('./src/config/db')

connectDB().then(async () => {
  await Category.deleteMany({})
  await Category.insertMany([
    { name: 'Laptops' },
    { name: 'Smartphones' },
    { name: 'Headphones' },
    { name: 'Gaming Consoles' }
  ])
  console.log('✅ Categories seeded')
  mongoose.disconnect()
})
