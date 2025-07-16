// scripts/seedAdmin.js
require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./src/models/User')

async function seedAdmin() {
  await mongoose.connect(process.env.MONGODB_URI)

  const email = "hansal.bhangale@wohlig.com"
  const updated = await User.findOneAndUpdate(
    { email },
    { role: 'admin' },
    { new: true }
  )

  console.log('Updated User:', updated)
  mongoose.disconnect()
}

seedAdmin()
