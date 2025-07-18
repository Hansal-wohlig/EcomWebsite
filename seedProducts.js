// seedProducts.js
require('dotenv').config()
const mongoose = require('mongoose')
const Product = require('./src/models/Product')
const Category = require('./src/models/Category')
const connectDB = require('./src/config/db')

function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with -
    .replace(/[^\w\-]+/g, '')       // Remove all non-word chars
    .replace(/\-\-+/g, '-')         // Replace multiple - with single -
    .replace(/^-+/, '')             // Trim - from start of text
    .replace(/-+$/, '');            // Trim - from end of text
}

connectDB().then(async () => {
  try {
    // Get categories first
    const categories = await Category.find({})
    if (categories.length === 0) {
      console.log('❌ No categories found. Please run seedCategory.js first')
      mongoose.disconnect()
      return
    }

    // Clear existing products
    await Product.deleteMany({})
    
    // Sample products
    const sampleProducts = [
      {
        title: 'MacBook Pro 16-inch',
        description: 'Powerful laptop for professionals with M2 chip',
        price: 249999,
        stockQty: 10,
        category: categories.find(c => c.name === 'Laptops')._id,
        images: ['macbook-pro.jpg'],
        isActive: true
      },
      {
        title: 'iPhone 15 Pro',
        description: 'Latest iPhone with titanium design and A17 Pro chip',
        price: 149999,
        stockQty: 15,
        category: categories.find(c => c.name === 'Smartphones')._id,
        images: ['iphone-15-pro.jpg'],
        isActive: true
      },
      {
        title: 'Sony WH-1000XM5',
        description: 'Premium noise-cancelling headphones',
        price: 29999,
        stockQty: 20,
        category: categories.find(c => c.name === 'Headphones')._id,
        images: ['sony-headphones.jpg'],
        isActive: true
      },
      {
        title: 'PlayStation 5',
        description: 'Next-gen gaming console with DualSense controller',
        price: 49999,
        stockQty: 8,
        category: categories.find(c => c.name === 'Gaming Consoles')._id,
        images: ['ps5.jpg'],
        isActive: true
      },
      {
        title: 'Dell XPS 13',
        description: 'Ultra-thin laptop with InfinityEdge display',
        price: 129999,
        stockQty: 12,
        category: categories.find(c => c.name === 'Laptops')._id,
        images: ['dell-xps.jpg'],
        isActive: true
      },
      {
        title: 'Samsung Galaxy S24',
        description: 'Android flagship with AI features',
        price: 89999,
        stockQty: 18,
        category: categories.find(c => c.name === 'Smartphones')._id,
        images: ['samsung-s24.jpg'],
        isActive: true
      }
    ]

    // Add slugs to products
    const productsWithSlugs = sampleProducts.map(product => ({
      ...product,
      slug: slugify(product.title)
    }))

    await Product.insertMany(productsWithSlugs)
    console.log('✅ Products seeded successfully')
    console.log('📦 Added', productsWithSlugs.length, 'products')
    
    mongoose.disconnect()
  } catch (error) {
    console.error('❌ Error seeding products:', error)
    mongoose.disconnect()
  }
}) 