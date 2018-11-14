import User from '../app/models/m_user'
import { Strategy as LocalStrategy } from 'passport-local'
import { BasicStrategy } from 'passport-http'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
// import dateFormat from 'dateformat'
// import { addLogSignin } from '../app/services/user'

// expose this function to our app using module.exports
export default function (passport) {
  // used to serialize the user for the session
  passport.serializeUser((user, done) => {
    done(null, user)
  })

  // used to deserialize the user
  passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
      done(err, user)
    })
  })

  passport.use('local-login', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true // allows us to pass back the entire request to the callback
  },
  function (req, username, password, done) { // callback with email and password from our form
    // find a user whose email is the same as the forms email
    // we are checking to see if the user trying to login already exists
    User.findOne({ 'username': username }, (err, user) => {
      // if there are any errors, return the error before anything else
      if (err) {
        // let log = {
        //   type: 'signin',
        //   user: username,
        //   ipAddress: req.connection.remoteAddress,
        //   success: false,
        //   note: 'Login error',
        //   log_dt: dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
        // }
        // addLogSignin(log).then((resAddLog) => {
        //   console.log(resAddLog)
        // }).catch((err) => {
        //   console.log(err)
        // })
        return done(null, false, req.flash('error', err))
      } // req.flash is the way to set flashdata using connect-flash

      // if no user is found, return the message
      if (!user) {
        // let log = {
        //   type: 'signin',
        //   user: username,
        //   ipAddress: req.connection.remoteAddress,
        //   success: false,
        //   note: 'Not found username',
        //   log_dt: dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
        // }
        // addLogSignin(log).then((resAddLog) => {
        //   console.log(resAddLog)
        // }).catch((err) => {
        //   console.log(err)
        // })
        return done(null, false)
      } // req.flash is the way to set flashdata using connect-flash

      // if the user is found but the password is wrong
      if (!user.validPassword(password)) {
        // let log = {
        //   type: 'signin',
        //   user: username,
        //   ipAddress: req.connection.remoteAddress,
        //   success: false,
        //   note: 'Invalid password',
        //   log_dt: dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
        // }
        // addLogSignin(log).then((resAddLog) => {
        //   console.log(resAddLog)
        // }).catch((err) => {
        //   console.log(err)
        // })
        return done(null, false)
      } // create the loginMessage and save it to session as flashdata

      // if(user.status === 'inactive')
      //  return done(null, false, req.flash('error', 'Your Account Not Activated ,Please Check Your Email')); // create the loginMessage and save it to session as flashdata

      // all is well, return successful user
      // let log = {
      //   type: 'signin',
      //   user: username,
      //   ipAddress: req.connection.remoteAddress,
      //   success: true,
      //   note: 'Demestic MIS',
      //   log_dt: dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
      // }
      // addLogSignin(log).then((resAddLog) => {
      //   console.log(resAddLog)
      //   req.session.user = user
      return done(null, user)
      // }).catch((err) => {
      //   console.log(err)
      //   return done(err, false)
      // })
    })
  }))

  passport.use('basic-auth', new BasicStrategy((username, password, done) => {
    User.findOne({ 'username': username }, (err, user) => {
      if (err) { return done(err) }

      if (!user) { return done(null, false) }

      if (!user.validPassword(password)) { return done(null, false) }

      if (user.role_id !== 1) { return done(null, false) }

      return done(null, user)
    })
  }))

  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: 'Demestic MIS'
  }
  passport.use('jwt-auth', new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.subj.user).select({ password: 0, create_time: 0, __v: 0 }).then((user) => {
      if (user) {
        return done(null, user)
      } else {
        return done(null, false)
      }
    })
      .catch(err => { return done(err, false) })
  }))
}
