const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const User = require('./models/users')
const bcrypt = require('bcryptjs')

module.exports = function (passport) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        const newUser = {
          googleId: profile.id,
          displayName: profile.displayName,
          firstName: profile.name.givenName,
          lastName: profile.name.familyName,
          image: profile.photos[0].value,
        }

        try {
          let user = await User.findOne({ googleId: profile.id })

          if (user) {
            done(null, user)
          } else {
            user = await User.create(newUser)
            done(null, user)
          }
        } catch (err) {
          console.error(err)
        }
      }
    )
  )
  // passport.use(
  //   'local',
  //   new LocalStrategy(
  //     {
  //       usernameField: 'email',
  //       passwordField: 'password',
  //       passReqToCallback: true,
  //     },
  //     (email, password, done) => {
  //       // Match user
  //       User.findOne({
  //         'local.email': email,
  //       }).then((user) => {
  //         if (!user) {
  //           return done(null, false, {
  //             message: 'That email is not registered',
  //           })
  //         }

  //         // Match password
  //         bcrypt.compare(password, user.password, (err, isMatch) => {
  //           if (err) throw err
  //           if (isMatch) {
  //             return done(null, user)
  //           } else {
  //             return done(null, false, { message: 'Password incorrect' })
  //           }
  //         })
  //       })
  //     }
  //   )
  // )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
