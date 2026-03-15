// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const flash = require('connect-flash');
const path = require('path');

const app = express();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.use(flash());

app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success');
  res.locals.error_msg = req.flash('error');
  next();
});

app.use((req, res, next) => {
  res.locals.session = req.session;
  next();
});

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Import routes with error handling
let indexRoutes, authRoutes, adminRoutes, chatRoutes;
try {
  indexRoutes = require('./routes/index');
  console.log('indexRoutes type:', typeof indexRoutes);
} catch (e) {
  console.error('Error loading indexRoutes:', e.message);
}
try {
  authRoutes = require('./routes/auth');
  console.log('authRoutes type:', typeof authRoutes);
} catch (e) {
  console.error('Error loading authRoutes:', e.message);
}
try {
  adminRoutes = require('./routes/admin');
  console.log('adminRoutes type:', typeof adminRoutes);
} catch (e) {
  console.error('Error loading adminRoutes:', e.message);
}
try {
  chatRoutes = require('./routes/chat');
  console.log('chatRoutes type:', typeof chatRoutes);
} catch (e) {
  console.error('Error loading chatRoutes:', e.message);
}

// Import sitemap controller (no try-catch needed as it's a simple function)
const sitemapController = require('./controllers/sitemapController');

if (typeof indexRoutes === 'function') app.use('/', indexRoutes);
else console.error('❌ indexRoutes is not a function – skipping');
if (typeof authRoutes === 'function') app.use('/', authRoutes);
else console.error('❌ authRoutes is not a function – skipping');
if (typeof adminRoutes === 'function') app.use('/admin', adminRoutes);
else console.error('❌ adminRoutes is not a function – skipping');
if (typeof chatRoutes === 'function') app.use('/api/chat', chatRoutes);
else console.error('❌ chatRoutes is not a function – skipping');

// Sitemap route
app.get('/sitemap.xml', sitemapController.getSitemap);

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});