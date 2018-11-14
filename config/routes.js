import { createUser, getAllUser, updateUserData, deleteUser, signInUser } from '../app/controllers/authorization'

module.exports = function (app, passport) {
//   const basicAuth = passport.authenticate('basic-auth', { session: false })
  // const jwtAuth = passport.authenticate('jwt-auth', { session: false })
  const localAuth = passport.authenticate('local-login', { session: false })

  app.get('/', function (req, res) {
    res.send('Server started')
  })

  // #region API for Authorization
  app.post('/api/client/signin', localAuth, signInUser)
  // #endregion

  // #region API for User Management
  app.post('/api/user/newUser', createUser)
  app.get('/api/user/getAllUser', getAllUser)
  app.put('/api/user/updateUser', updateUserData)
  app.delete('/api/user/deleteUser', deleteUser)
  // #endregion
}
