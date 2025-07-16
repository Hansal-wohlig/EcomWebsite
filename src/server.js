const express = require('express')
const path = require('path')
require('dotenv').config()
const session = require('express-session')
const MongoStore = require('connect-mongo')
const passport = require('passport')
const connectDB = require('./config/db.js')
const { title } = require('process')
const authRoutes = require('./routes/auth')
const app = express()
require('./config/passport.js')(passport)

console.log('Google Client ID:', process.env.GOOGLE_CLIENT_ID)
connectDB()
app.use(
    session({
        secret:process.env.SESSION_SECRET,
        resave:false,
        saveUninitialized:false,
        store:MongoStore.create({
            mongoUrl:process.env.MONGODB_URI
        })
    })
)
app.use(passport.initialize())
app.use(passport.session())
app.use('/auth', authRoutes)
app.use((req,res,next)=>{
    res.locals.user = req.user || null
    next()
})




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