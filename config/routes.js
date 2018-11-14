module.exports = function (app, passport) {
//   const basicAuth = passport.authenticate('basic-auth', { session: false })
//   const jwtAuth = passport.authenticate('jwt-auth', { session: false })
//   const localAuth = passport.authenticate('local-login', { session: false })
  app.get('/', function (req, res) {
    res.send('Server started')
  })
}
