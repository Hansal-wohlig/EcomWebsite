module.exports = function ensureAdmin(req, res, next) {
    if (req.isAuthenticated && req.isAuthenticated()) {
      if (req.user.role === 'admin') {
        return next()
      }
    }
    res.redirect('/auth/google') // Or show access denied
  }
  