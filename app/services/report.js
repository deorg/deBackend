import oracledb from 'oracledb'
import constants from '../../config/constants'

export function getBranch (brhId) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`branchID = ${brhId}`)
      let sqlstatement = `select sale_brh_id brh_id, sale_brh_name brh_name from sale_branch where sale_brh_use = 'Y' and sale_brh_id like '${brhId}' order by brh_id`
      oracleExecute(sqlstatement).then((resBranch) => {
        console.log('--------- inside get branch -------------------------')
        console.log(resBranch)
        resolve(resBranch)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function getMonthlyMeeting (startDate, endDate) {
  return new Promise((resolve, reject) => {
    try {
      let sqlstatement = `SELECT
      BRH_ID,
      SUM(SALE_AMT) SALE_AMT,
      SUM(PAY_AMT) PAY_AMT,
      
      SUM(SALE_AMT) - PSA.FBRH_SUM(BRH_ID, 'TAR', MIN(MDATE), MAX(DDATE)) DIF_TAR_AMT,
         
      PSA.FBRH_SUM(BRH_ID, 'SALE', TRUNC(MDATE,'YY'), MAX(DDATE)) ACC_SALE_AMT,
      PSA.FBRH_SUM(BRH_ID, 'PAY', TRUNC(MDATE,'YY'), MAX(DDATE)) ACC_PAY_AMT,
      PSA.FBRH_SUM(BRH_ID, 'TAR', TRUNC(MDATE,'YY'), MAX(DDATE)) ACC_TAR_AMT,
      Nvl(PSA.FBRH_SUM(BRH_ID, 'TAR', MIN(MDATE), MAX(DDATE)), 0) TAR_AMT,  

      SUM(PDO_LOSS_GAIN) LOS_PDO_AMT,
      SUM(PDO_AMT) PDO_AMT,
      PNODE.FCUST_PDO_AMT(BRH_ID, MDATE, 'O') OCUST_PDO_AMT,
      PNODE.FCUST_PDO_AMT(BRH_ID, MDATE, 'N') NCUST_PDO_AMT,
      PNODE.FREMAIN_AMT(BRH_ID, MDATE) FREMAIN_AMT,

      PNODE.FMGRS_NAME(BRH_ID, MDATE) MGRS_Name
      
      FROM SA010V
      WHERE BRH_ID LIKE '%'
      AND MDATE BETWEEN TRUNC(TO_DATE('${startDate}','DD/MM/RRRR'),'MM') AND TRUNC(TO_DATE('${endDate}','DD/MM/RRRR'),'MM')
      AND BRH_ID < 66
     
      GROUP BY BRH_ID, MDATE
      ORDER BY BRH_ID`
      oracleExecute(sqlstatement).then((resMonthly) => {
        console.log(resMonthly)
        resolve(resMonthly)
      })
    } catch (err) {
      reject(err)
    }
  })
}

// export function getPathSaleInfo (brh, startDate, endDate) {
//   return new Promise((resolve, reject) => {
//     try {
//       let sqlstatement = `SELECT
//       BRH_ID,
//       PATH_NO,
//       SUM(TAR_SALE_AMT) TAR_AMT,
//       SUM(SALE_AMT) SALE_AMT,
//       SUM(PAY_AMT) PAY_AMT,
//       SUM(SALE_AMT) - SUM(TAR_SALE_AMT) DIF_TAR_AMT,
//       PSA.FBRH_PATH_SUM(BRH_ID, PATH_NO, 'PDO', MIN(DDATE), MAX(DDATE))  PDO_AMT

//       FROM SA010V
//       WHERE BRH_ID = '${brh}'
//       AND MDATE BETWEEN TRUNC(TO_DATE('${startDate}','DD-MM-RRRR'),'MM') AND TRUNC(TO_DATE('${endDate}','DD-MM-RRRR'),'MM')
//       AND BRH_ID < 66

//       GROUP BY BRH_ID, PATH_NO
//       ORDER BY BRH_ID, PATH_NO`
//       // AND DDATE BETWEEN TRUNC(SYSDATE,'YY') AND TRUNC(SYSDATE,'MM')-1
//       let header = ['เป้าการขาย', 'ยอดขาย', 'ยอดเก็บ', 'ขาด/เกิน', 'PDO']
//       oracleExecute(sqlstatement, header).then((resSale) => {
//         console.log(resSale)
//         resolve(resSale)
//       })
//     } catch (err) {
//       reject(err)
//     }
//   })
// }

export function getPathSaleInfo (brh, startDate, endDate) {
  console.log(startDate)
  console.log(endDate)
  return new Promise((resolve, reject) => {
    try {
      let sqlstatement = `SELECT
      BRH_ID,
      PATH_NO,
      PMAS.PATH_NAME(BRH_ID, PATH_NO) PATH_NAME,
      
      SUM(TAR_SALE_AMT) TAR_AMT,
      SUM(SALE_AMT) SALE_AMT,
      SUM(PAY_AMT) PAY_AMT,
      
      SUM(SALE_AMT) - SUM(TAR_SALE_AMT) DIF_TAR_AMT,
      SUM(PDO_LOSS_GAIN) PDO_LOSS_GAIN
  
      FROM  SA010V
      WHERE /*BRH_ID = ${brh}
      AND*/ MDATE BETWEEN TRUNC(TO_DATE('${startDate}','DD/MM/RRRR'),'MM') AND TRUNC(TO_DATE('${endDate}','DD/MM/RRRR'),'MM')
      AND BRH_ID < 66
      GROUP BY BRH_ID, PATH_NO
      ORDER BY BRH_ID`
      // AND DDATE BETWEEN TRUNC(SYSDATE,'YY') AND TRUNC(SYSDATE,'MM')-1
      let header = ['เป้าการขาย', 'ยอดขาย', 'ยอดเก็บ', 'ขาด/เกิน', 'PDO เพิ่ม/ลด']
      oracleExecute(sqlstatement, header).then((resSale) => {
        console.log(resSale)
        resolve(resSale)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function getSaleInfo (startDate, endDate) {
  console.log(startDate)
  console.log(endDate)
  return new Promise((resolve, reject) => {
    try {
      let sqlstatement = `SELECT
      BRH_ID,
      PSA.FBRH_SUM(BRH_ID, 'TAR', MIN(MDATE), MAX(DDATE)) TAR_AMT,
      SUM(SALE_AMT) SALE_AMT,
      SUM(PAY_AMT) PAY_AMT,
      SUM(SALE_AMT) - PSA.FBRH_SUM(BRH_ID, 'TAR', MIN(MDATE), MAX(DDATE)) DIF_TAR_AMT,
      SUM(PDO_LOSS_GAIN) PDO_LOSS_GAIN
      
      FROM SA010V
      WHERE BRH_ID LIKE '%'
      AND MDATE between TRUNC(TO_DATE('${startDate}','DD-MM-RRRR'),'MM') AND TRUNC(TO_DATE('${endDate}','DD-MM-RRRR'),'MM')
      AND BRH_ID < 66
     
      GROUP BY BRH_ID
      ORDER BY BRH_ID`
      // AND DDATE BETWEEN TRUNC(SYSDATE,'YY') AND TRUNC(SYSDATE,'MM')-1
      let header = ['เป้าการขาย', 'ยอดขาย', 'ยอดเก็บ', 'ขาด/เกิน', 'PDO เพิ่ม/ลด']
      oracleExecute(sqlstatement, header).then((resSale) => {
        console.log(resSale)
        resolve(resSale)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function oracleExecute (sqlstatement, header) {
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
              header: header,
              data: result.rows
            })
          }
        })
      }
    })
  })
}
