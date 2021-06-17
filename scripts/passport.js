const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const LocalStrategy = require('passport-local').Strategy
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('../models/users')

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

  passport.use(
    'local.user.signup',
    new LocalStrategy(
      {
        //Get the username field and password field on req.body
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        req
          .checkBody('email', 'Invalid Credentials, Please check email')
          .notEmpty()
          .isEmail()
        req
          .checkBody(
            'password',
            'Password should atleast contain more than six characters'
          )
          .notEmpty()
          .isLength({ min: 6 })
        req.checkBody('name', 'Name is required').notEmpty()

        //Validate Error
        let errors = req.validationErrors()
        //If there's error push the error to messages[index] = error array
        if (errors) {
          let messages = []
          errors.forEach((error) => {
            messages.push(error.msg)
          })

          //If there's error, create an alert that there's error, if you want to modify flash messages
          //set flash messages error info: req.flash('error', "Invalid Credentials, Please check username or password")
          return done(null, false, req.flash('error', messages))
        }

        User.findOne({ 'local.email': email }, (err, trainer) => {
          if (err) {
            return done(err)
          }
          if (user) {
            return done(null, false, {
              message: 'That email is already taken!',
            })
          }
          //After everything is validated, Create new trainer
          let newUser = new User()

          newUser.local.email = email
          newUser.local.password = newTrainer.generateHash(password)
          newUser.local.name = req.body.name
          newUser.local.age = req.body.age
          newUser.local.birthday = req.body.birthday
          newUser.local.address = req.body.address
          newUser.local.specialization = req.body.specialization
          newUser.local.phone = req.body.phone
          newUser.local.rate = req.body.rate
          newUser.local.image = req.body.image

          newTrainer.save((err, result) => {
            if (err) {
              return done(err)
            }
            return done(null, newUser)
          })
        })
      }
    )
  )

  // Login
  passport.use(
    'local.user.login',
    new LocalStrategy(
      {
        //Get the username field and password field on req.body
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true,
      },
      (req, email, password, done) => {
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //Check if email or password is empty, then validate error using the express-validator module
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        req
          .checkBody('email', 'Invalid Credentials, Please check email')
          .notEmpty()
          .isEmail()
        req
          .checkBody('password', 'Invalid Credentials, Please check password')
          .notEmpty()
        let errors = req.validationErrors()

        if (errors) {
          let messages = []
          errors.forEach((error) => {
            messages.push(error.msg)
          })

          //If there's error, create an alert that there's error, if you want to modify flash messages
          //set flash messages error info: req.flash('error', "Invalid Credentials, Please check username or password")
          return done(null, false, req.flash('error', messages))
        }

        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        //A query that will search for an existing trainer in the mongo database, then after everything is validated, Log in the user
        //Find local.email from the database of trainer
        //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
        User.findOne({ 'local.email': email }, (err, user) => {
          if (err) {
            return done(err)
          }
          if (!user) {
            return done(null, false, {
              message:
                'The trainer does not exist. Click sign up to register as a trainer.',
            })
          }
          if (!user.validPassword(password)) {
            return done(null, false, {
              message:
                'Password is invalid, Please check your password and try again.',
            })
          }
          return done(null, user)
        })
      }
    )
  )

  passport.serializeUser((user, done) => {
    done(null, user.id)
  })

  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => done(err, user))
  })
}
