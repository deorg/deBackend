import oracledb from 'oracledb'
import constants from '../../config/constants'

export function getBranch (brhId) {
  return new Promise((resolve, reject) => {
    try {
      let sqlstatement = `select sale_brh_id brh_id, sale_brh_name brh_name from sale_branch where sale_brh_use = 'Y' and sale_brh_id like '${brhId}' order by brh_id`
      oracleExecute(sqlstatement).then((resBranch) => {
        console.log(resBranch)
        resolve(resBranch)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function getSaleInfo (brhId) {
  return new Promise((resolve, reject) => {
    try {
      let sqlstatement = `select to_char(trunc(work_date,'mm'),'mon') mm, sum(tar_sale_amt) tar_amt, sum(sale_amt) sale_amt from sa010 where trunc(work_date,'yy') = trunc(sysdate,'yy') and brh_id = '${brhId}' group by trunc(work_date,'mm') order by trunc(work_date,'mm')`
      oracleExecute(sqlstatement).then((resSale) => {
        console.log(resSale)
        resolve(resSale)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function oracleExecute (sqlstatement) {
  return new Promise((resolve, reject) => {
    oracledb.getConnection(constants.database.oracle.production, (err, connection) => {
      if (err) return reject(err)
      else {
        connection.execute(sqlstatement, [], { outFormat: oracledb.OBJECT }, (error, result) => {
          if (error) return reject(error)
          else {
            connection.close()
            return resolve({
              status: 'SUCCESS',
              data: result.rows
            })
          }
        })
      }
    })
  })
}
