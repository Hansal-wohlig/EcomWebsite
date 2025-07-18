module.exports = (req, res, next) => {
    if (req.isAuthenticated()) return next();
    
    // For API requests, return JSON error instead of redirect
    if (req.path.startsWith('/api/')) {
        return res.status(401).json({
            success: false,
            message: 'Authentication required. Please login first.'
        });
    }
    
    res.redirect('/auth/google'); 
}
  