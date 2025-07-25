const express = require('express');
const path = require('path');
require('dotenv').config();
const session = require('express-session');
const MongoStore = require('connect-mongo');
const passport = require('passport');
const connectDB = require('./config/db');
const methodOverride = require('method-override');
// Routes
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const categoryRoutes = require('./routes/categories');
const adminRoutes = require('./routes/admin');
const publicRoutes = require('./routes/public');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');

const app = express(); // <-- Define app before using it

// ✅ Connect MongoDB
connectDB();

// ✅ Setup view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ✅ Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, '..','public', 'uploads')));
app.use(methodOverride('_method'));

// ✅ Body parsers
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ Session middleware (must come before passport)
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI
    })
  })
);

// ✅ Passport setup (must come after session)
require('./config/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());

// ✅ User data in views (makes user available in all EJS templates)
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// ✅ Routes
app.use('/auth', authRoutes);
app.use('/admin/products', productRoutes);
app.use('/admin/categories', categoryRoutes);
app.use('/admin', adminRoutes); // Keep this last in /admin group to avoid conflicts

// ✅ Landing Page
app.get('/', (req, res) => {
  res.render('landing', { title: 'Home', user: req.user || null });
});

app.use('/', publicRoutes);
app.use('/', cartRoutes);
app.use('/', checkoutRoutes);

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log('SERVER RUNNING ON', PORT);
});