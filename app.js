import express from 'express'
import constant from './config/constants'
import mongoose from 'mongoose'
import passport from 'passport'
import flash from 'connect-flash'
import morgan from 'morgan'
import cookieParser from 'cookie-parser'
import { json, urlencoded } from 'body-parser'
import session from 'express-session'
import router from './config/routes'
import _passport from './config/passport'
import cors from 'cors'
import path from 'path'

global.__basedir = __dirname

var publicDir = require('path').join(__dirname, '/assets/gallery')
var port = process.env.PORT || 8042
var app = express()
app.use(json({ limit: '50mb', extended: true }))
app.use(urlencoded({ limit: '50mb', extended: true }))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Content-Type')
  res.setHeader('Access-Control-Allow-Credentials', true)
  next()
})
app.use(cors())
app.use('/pics', express.static(publicDir))

/** *************Mongodb configuratrion********************/

// configuration ===============================================================
mongoose.set('debug', true)
mongoose.Promise = global.Promise

export const database = mongoose.connect(constant.database.mongo.test.url, constant.database.mongo.test.userDB)
export const basePath = __dirname

_passport(passport) // pass passport for configuration

// set up our express application
app.use(morgan('dev')) // log every request to the console
app.use(cookieParser()) // read cookies (needed for auth)
// app.use(bodyParser()) // get information from html forms

// view engine setup
app.use(express.static(path.join(basePath, 'public')))
console.log(basePath)
// app.set('views', path.join(__dirname, 'app/views'));
// app.set('view engine', 'ejs');

/// /app.set('view engine', 'ejs'); // set up ejs for templating

app.use(session({
  secret: 'Demestic MIS',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 5 * 60 * 1000 }
}))

app.use(passport.initialize())
app.use(passport.session()) // persistent login sessions
app.use(flash()) // use connect-flash for flash messages stored in session

// routes ======================================================================
router(app, passport) // load our routes and pass in our app and fully configured passport

// launch ======================================================================
app.listen(port)
// app.get('/*', (req, res) => {
//   res.sendFile(path.join(__dirname))
// })
console.log('Server started on port ' + port)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  res.status(404).end('Sorry, path not found!')
})

app.use(function (req, res, next) {
  res.status(500).render('404', { title: 'Sorry, page not found' })
})

exports = module.exports = app
