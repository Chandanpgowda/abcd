// middleware/auth.js
module.exports = {
  isAdmin: (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
      next();
    } else {
      req.flash('error', 'Access denied. Admins only.');
      res.redirect('/login');
    }
  }
};