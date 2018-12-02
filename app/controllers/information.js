import { getBranch, getSaleInfo as getSale, getMonthlyMeeting as getMonthly, getPathSaleInfo } from '../services/report'

export function getAllBranch (req, res, next) {
  getBranch(req.query.branch_id).then((resBrh) => {
    console.log('--------------------------------------------------')
    console.log(resBrh)
    res.send(resBrh)
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function getMonthlyMeeting (req, res, next) {
  getMonthly(req.query.startDate, req.query.endDate).then((resMonthly) => {
    console.log(resMonthly)
    res.send(resMonthly)
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function getPathInfo (req, res, next) {
  console.log(req.query)
  getPathSaleInfo(req.query.branch_id, req.query.startDate, req.query.endDate).then((resSale) => {
    console.log(resSale)
    res.send(resSale)
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function getSaleInfo (req, res, next) {
  getSale(req.query.startDate, req.query.endDate).then((resSale) => {
    console.log(resSale)
    res.send(resSale)
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}
// export function getAllBranch (req, res, next) {
//   let branchId = req.query.branch_id
//   console.log(branchId)
//   let sqlstatement = `select sale_brh_id brh_id, sale_brh_name brh_name from sale_branch where sale_brh_use = 'Y' and sale_brh_id like '${branchId}' order by brh_id`
//   oracleExecute(sqlstatement, res)
// }

// function oracleExecute (sqlstatement, res) {
//   var config = {
//     'user': 'DE',
//     'password': 'DE',
//     'connectString': '(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=192.168.1.10)(PORT=1521))(CONNECT_DATA=(SERVER=DEDICATED)(SERVICE_NAME=HPDB)))'
//   }
//   oracledb.getConnection(config,
//     function (err, connection) {
//       if (err) console.error(err)
//       else {
//         connection.execute(sqlstatement, [], { outFormat: oracledb.OBJECT },
//           function (error, result) {
//             if (error) console.error(error)
//             else res.send(result.rows)
//             console.log(result)
//             console.log(result.rows)
//             connection.close()
//           })
//       }
//     })
// }
