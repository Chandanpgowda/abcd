const User = require('../models/User');
const bcrypt = require('bcrypt');

// @desc    Show login page
// @route   GET /login
exports.getLogin = (req, res) => {
  if (req.session.user) {
    return req.session.user.role === 'admin' ? res.redirect('/admin') : res.redirect('/');
  }
  res.render('auth/login', { 
    error: req.flash('error'),
    success: req.flash('success'),
    email: '' 
  });
};

// @desc    Show register page
// @route   GET /register
exports.getRegister = (req, res) => {
  if (req.session.user) {
    return req.session.user.role === 'admin' ? res.redirect('/admin') : res.redirect('/');
  }
  res.render('auth/register', { 
    error: req.flash('error'),
    success: req.flash('success'),
    name: '', 
    email: '' 
  });
};

// @desc    Handle registration
// @route   POST /register
exports.postRegister = async (req, res) => {
  const { name, email, password } = req.body;
  const errors = [];

  // Validation
  if (!name || !email || !password) {
    errors.push('All fields are required');
  }
  if (password && password.length < 6) {
    errors.push('Password must be at least 6 characters');
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email && !emailRegex.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (errors.length > 0) {
    req.flash('error', errors.join(', '));
    return res.render('auth/register', {
      error: req.flash('error'),
      success: '',
      name,
      email
    });
  }

  try {
    // Check if user already exists
    const existing = await User.findOne({ email });
    if (existing) {
      req.flash('error', 'Email is already registered');
      return res.render('auth/register', {
        error: req.flash('error'),
        success: '',
        name,
        email
      });
    }

    // Hash password manually
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.create({ name, email, password: hashedPassword, role: 'member' });

    req.flash('success', 'Registration successful! Please log in.');
    res.redirect('/login');
  } catch (err) {
    console.error('========== REGISTRATION ERROR ==========');
    console.error(err);
    console.error('========================================');
    req.flash('error', 'Something went wrong. Please try again.');
    res.render('auth/register', {
      error: req.flash('error'),
      success: '',
      name,
      email
    });
  }
};

// @desc    Handle login
// @route   POST /login
exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    req.flash('error', 'Please provide both email and password');
    return res.render('auth/login', {
      error: req.flash('error'),
      success: '',
      email
    });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'Invalid credentials');
      return res.render('auth/login', {
        error: req.flash('error'),
        success: '',
        email
      });
    }

    const match = await user.comparePassword(password);
    if (!match) {
      req.flash('error', 'Invalid credentials');
      return res.render('auth/login', {
        error: req.flash('error'),
        success: '',
        email
      });
    }

    // Set session
    req.session.user = {
      id: user._id,
      name: user.name,
      role: user.role
    };

    req.flash('success', 'Logged in successfully!');
    
    // Redirect based on role
    if (user.role === 'admin') {
      res.redirect('/admin');
    } else {
      res.redirect('/');
    }
  } catch (err) {
    console.error('Login error:', err);
    req.flash('error', 'Login failed. Please try again.');
    res.render('auth/login', {
      error: req.flash('error'),
      success: '',
      email
    });
  }
};

// @desc    Logout user
// @route   GET /logout
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
    }
    res.redirect('/');
  });
};