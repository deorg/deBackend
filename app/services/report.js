import oracledb from 'oracledb'
import constants from '../../config/constants'

export function oracleExecute (sqlstatement, res) {
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
