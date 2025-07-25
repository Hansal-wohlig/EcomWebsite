const GoogleStrategy = require('passport-google-oauth20').Strategy
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = function(passport){
    passport.use(
        new GoogleStrategy(
            {
                clientID:process.env.GOOGLE_CLIENT_ID,
                clientSecret:process.env.GOOGLE_CLIENT_SECRET,
                callbackURL:`${process.env.BASE_URL}/auth/google/callback`
            },
            async(accessToken, refreshToken, profile, done)=>{
                const newUser={
                    googleId:profile.id,
                    name:profile.displayName,
                    email:profile.emails[0].value
                }
                try{
                    let user = await User.findOne({googleId:profile.id})
                    if(user) return done(null,user)

                    user = await User.create(newUser)
                    return done(null,user)
                }catch(err){
                    return done(err,null)
                }
            }
        )
    )
    passport.serializeUser((user,done)=>{
        done(null,user.id)
    })
    passport.deserializeUser(async (id, done) => {
        const user = await User.findById(id)
        done(null, user)
      })
}