import { createUser, getAllUser, updateUserData, deleteUser, signInUser } from '../app/controllers/authorization'
import { getAllBranch, getSaleInfo, getMonthlyMeeting } from '../app/controllers/information'
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

  // #region API for get Information
  app.get('/api/information/getBranch', getAllBranch)
  app.get('/api/information/getSaleInfo', getSaleInfo)
  app.get('/api/information/getMonthlyMeeting', getMonthlyMeeting)
  //   app.get('/data',function (req, res) {
  //     let sqlstatement = `SELECT * from tab`;
  //     oracleExecute(sqlstatement, res);
  // })

  // app.post('/branch',function (req, res) {
  //     let brh_id = req.body.brh_id;
  //     let sqlstatement = `select sale_brh_id brh_id, sale_brh_name brh_name from sale_branch where sale_brh_use = 'Y' and sale_brh_id like '${brh_id}' order by brh_id`;
  //     oracleExecute(sqlstatement, res);
  // })

// app.post('/chart',function (req, res) {
//     let brh_id = req.body.brh_id;
//     let sqlstatement = `select to_char(trunc(work_date,'mm'),'mon') mm, sum(tar_sale_amt) tar_amt, sum(sale_amt) sale_amt from sa010 where trunc(work_date,'yy') = trunc(sysdate,'yy') and brh_id = '${brh_id}' group by trunc(work_date,'mm') order by trunc(work_date,'mm')`;
//     oracleExecute(sqlstatement, res);
// })
  // #endregion
}
