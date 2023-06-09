const localStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')
const e = require('express')

function initialize(passport, getUserByEmail, getUserById) {
   const authenticateUser = async (email, password, done) => {
      const user = getUserByEmail(email)
      if(user == null) {
         return done(null, false, {message: 'No user with this Email'})
      }
      
      try {
         if(await bcrypt.compare(password,user.password)) {
            return done(null, user)
         } else {
            return done(null, false, {message: 'Incorrect password'})
         }
      } catch (error) {
         return done(error)
      }

   }
   passport.use(new localStrategy({usernameField:'email'}, authenticateUser))
   passport.serializeUser((user, done) => {
      done(null, user.id)
   })
   passport.deserializeUser((id, done)=> {
      return done(null, getUserById(id))
   })
}

module.exports = initialize