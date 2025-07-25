const router = require('express').Router()
const passport = require('passport')

router.get('/google',passport.authenticate('google',{scope:['profile','email']}))

router.get("/google/callback",
    passport.authenticate('google',{
        failureRedirect:'/'
    }),
    (req,res)=>{
        res.redirect('/')
    }
)

router.get('/logout', (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        console.error('Logout error:', err)
        return next(err)
      }
      res.redirect('/')
    })
  })

module.exports = router