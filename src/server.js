const express = require('express')
const path = require('path')
const dotenv = require('dotenv')
const connectDB = require('./config/db.js')
const { title } = require('process')
const app = express()

dotenv.config()
connectDB()

app.set('view engine','ejs')
app.set('views',path.join(__dirname,'views'))

app.use(express.static(path.join(__dirname,'public')))

app.get('/',(req,res)=>{
    res.render('landing',{title:'Home'})
})

const PORT = process.env.PORT

app.listen(PORT,()=>{
    console.log("SERVER RUNNING ON",PORT)
})