import { createUser, getAllUser, updateUserData, deleteUser, signInUser } from '../app/controllers/authorization'
import { getAllBranch, getSaleInfo, getMonthlyMeeting, getPathInfo } from '../app/controllers/information'
import { createNews, getNews, newCatetory, getCategory, deleteNews, deleteImg, editNews } from '../app/controllers/newsController'
import { newAlbum } from '../app/controllers/imageController'
module.exports = function (app, passport) {
//   const basicAuth = passport.authenticate('basic-auth', { session: false })
  // const jwtAuth = passport.authenticate('jwt-auth', { session: false })
  const localAuth = passport.authenticate('local-login', { session: false })

  // app.get('/', function (req, res) {
  //   res.send('Server started')
  // })

  // #region API for Authorization
  app.post('/api/client/signin', localAuth, signInUser)
  // #endregion

  // #region API for User Management
  app.post('/api/user/newUser', createUser)
  app.get('/api/user/getAllUser', getAllUser)
  app.put('/api/user/updateUser', updateUserData)
  app.delete('/api/user/deleteUser', deleteUser)
  // #endregion

  // #region News mangement
  app.post('/api/news/createNews', createNews)
  app.get('/api/news/getNews', getNews)
  app.post('/api/news/newCategory', newCatetory)
  app.get('/api/news/getCategory', getCategory)
  app.post('/api/news/deleteNews', deleteNews)
  app.get('/api/news/deleteImg', deleteImg)
  app.post('/api/news/editNews', editNews)
  // #endregion

  // #region API for get Information
  app.get('/api/information/getBranch', getAllBranch)
  app.get('/api/information/getSaleInfo', getSaleInfo)
  app.get('/api/information/getMonthlyMeeting', getMonthlyMeeting)
  app.get('/api/information/getPathInfo', getPathInfo)
  // #endregion

  // #region  Thumbnail
  app.post('/api/new/album', newAlbum)
}
