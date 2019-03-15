/* eslint-disable indent */
/* eslint-disable space-before-function-paren */
import oracledb from 'oracledb'
import constants from '../../config/constants'

export function getBranch(brhId) {
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

export function getCustomerProfile(id) {
  return new Promise((resolve, reject) => {
    try {
      let sql = `SELECT CUST_NO, CUST_FIRSTNAME||' '||CUST_LASTNAME CUST_NAME, CUST_CITIZEN_NO CITIZEN_NO, TEL_SMS TEL
      FROM   CUSTOMER
      WHERE  CUST_NO = ${id}`
      oracleExecute(sql).then((resCust) => {
        resolve(resCust)
      })
    } catch (err) {
      reject(err)
    }
  })
}
export function getMessage(id) {
  return new Promise((resolve, reject) => {
    try {
      let sql = `SELECT SMS010_PK, CON_NO, NOTE SMS_NOTE, CREATED_TIME SMS_TIME
      FROM   SMS010
      WHERE  CUST_NO = ${id} AND CREATED_TIME > TRUNC(SYSDATE,'YY')`
      oracleExecute(sql).then((resSms) => {
        resolve(resSms)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function getMonthlyMeeting(startDate, endDate) {
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

export function getPathSaleInfo(brh, startDate, endDate) {
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

export function getSaleInfo(startDate, endDate) {
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

export function getSaleInfo2(startDate, endDate, sort = 'สาขา', filter = []) {
  sort = sort === '%' ? 'สาขา' : sort
  var slice = filter.split(',')
  console.log(startDate)
  console.log(endDate)
  console.log(slice)
  const sortOption = [{ columnName: 'สาขา', column: 'BRH_ID' },
  { columnName: 'เป้าการขาย', column: 'TAR_AMT' },
  { columnName: 'ยอดขาย', column: 'SALE_AMT' },
  { columnName: 'ยอดเก็บ', column: 'PAY_AMT' },
  { columnName: 'ขาด/เกิน', column: 'DIF_TAR_AMT' },
  { columnName: 'PDO เพิ่ม/ลด', column: 'PDO_LOSS_GAIN' }]
  const orderBy = sortOption.filter(obj => obj.columnName === sort)[0]
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
      ORDER BY ${orderBy.column}`
      oracleExecute(sqlstatement).then((resSale) => {
        let data = []
        let columnData = []
        let masterColumn = []
        resSale.forEach(element => masterColumn.push(element.BRH_ID))
        if (slice.length > 0) {
          slice.forEach(element => {
            resSale = resSale.filter(e => e.BRH_ID !== element)
          })
        }
        resSale.forEach(element => columnData.push(element.BRH_ID))
        data.push({
          columnName: 'สาขา',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.TAR_AMT))
        data.push({
          columnName: 'เป้าการขาย',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.SALE_AMT))
        data.push({
          columnName: 'ยอดขาย',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.PAY_AMT))
        data.push({
          columnName: 'ยอดเก็บ',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.DIF_TAR_AMT))
        data.push({
          columnName: 'ขาด/เกิน',
          data: columnData,
          hidden: true
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.PDO_LOSS_GAIN))
        data.push({
          columnName: 'PDO เพิ่ม/ลด',
          data: columnData,
          hidden: false
        })
        let result = {
          status: 'SUCCESS',
          masterColumn: masterColumn,
          data: data
        }
        console.log(result)
        resolve(result)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function getPathSaleInfo2(brh, startDate, endDate, sort = 'สายบริการ', filter = []) {
  sort = sort === '%' ? 'สายบริการ' : sort
  var slice = filter.split(',')
  console.log(startDate)
  console.log(endDate)
  console.log(slice)
  const sortOption = [{ columnName: 'สายบริการ', column: 'PATH_NO' },
  { columnName: 'เป้าการขาย', column: 'TAR_AMT' },
  { columnName: 'ยอดขาย', column: 'SALE_AMT' },
  { columnName: 'ยอดเก็บ', column: 'PAY_AMT' },
  { columnName: 'ขาด/เกิน', column: 'DIF_TAR_AMT' },
  { columnName: 'PDO เพิ่ม/ลด', column: 'PDO_LOSS_GAIN' }]
  const orderBy = sortOption.filter(obj => obj.columnName === sort)[0]
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
      WHERE BRH_ID = ${brh}
      AND MDATE BETWEEN TRUNC(TO_DATE('${startDate}','DD/MM/RRRR'),'MM') AND TRUNC(TO_DATE('${endDate}','DD/MM/RRRR'),'MM')
      AND BRH_ID < 66
      GROUP BY BRH_ID, PATH_NO
      ORDER BY ${orderBy.column}`
      oracleExecute(sqlstatement).then((resSale) => {
        let data = []
        let columnData = []
        let masterColumn = []
        resSale.forEach(element => masterColumn.push(element.PATH_NO))
        if (slice.length > 0) {
          slice.forEach(element => {
            resSale = resSale.filter(e => e.PATH_NO !== element)
          })
        }
        resSale.forEach(element => columnData.push(element.PATH_NO + ` ${element.PATH_NAME}`))
        data.push({
          columnName: 'สายบริการ',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.TAR_AMT))
        data.push({
          columnName: 'เป้าการขาย',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.SALE_AMT))
        data.push({
          columnName: 'ยอดขาย',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.PAY_AMT))
        data.push({
          columnName: 'ยอดเก็บ',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.DIF_TAR_AMT))
        data.push({
          columnName: 'ขาด/เกิน',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.PDO_LOSS_GAIN))
        data.push({
          columnName: 'PDO เพิ่ม/ลด',
          data: columnData,
          hidden: true
        })
        let result = {
          status: 'SUCCESS',
          masterColumn: masterColumn,
          data: data
        }
        resolve(result)
      })
    } catch (err) {
      reject(err)
    }
  })
}

export function getTarAmtBrh(year, sort = 'สาขา/สายบริการ', filter = [], pBranch) {
  sort = sort === '%' ? 'สาขา/สายบริการ' : sort
  var slice = filter.split(',')
  console.log(year)
  console.log(slice)
  console.log(sort)
  const sortOption = [
    { columnName: 'สาขา/สายบริการ', column: 'BRH_ID' },
    { columnName: 'เป้าการขาย', column: 'TAR_SALE_AMT' },
    { columnName: 'ยอดขายปี ' + (year-1).toString(), column: 'PSALE_AMT' }
  ]
  const orderBy = sortOption.filter(obj => obj.columnName === sort)[0]
  console.log(sortOption)
  console.log(orderBy)
  return new Promise((resolve, reject) => {
    try {
      let sqlstatement
      if (pBranch === '%') {
        sqlstatement = `SELECT
        BRH_ID, 
        SUM(PSALE_AMT) PSALE_AMT,
        SUM(TAR_SALE_AMT) TAR_SALE_AMT    
     FROM
        SA032
     WHERE
        TAR_YY = TRUNC(TO_DATE('${year}','YYYY'),'YY') 
     GROUP BY
        TAR_YY,
        BRH_ID
     ORDER BY
        ${orderBy.column}`
      } else {
        sqlstatement = `SELECT
        PATH_NO || ' ' || PMAS.PATH_NAME('${pBranch}', PATH_NO) BRH_ID, 
        SUM(PSALE_AMT) PSALE_AMT,
        SUM(TAR_SALE_AMT) TAR_SALE_AMT    
     FROM
        SA033
     WHERE
        TAR_MM = TO_DATE('01${year}','MMYYYY') AND BRH_ID = ${pBranch}
     GROUP BY
        TAR_MM,
        PATH_NO
     ORDER BY
     ${orderBy.column}`
      }
      oracleExecute(sqlstatement).then((resSale) => {
        console.log(resSale)
        let data = []
        let columnData = []
        let masterColumn = []
        resSale.forEach(element => masterColumn.push(element.BRH_ID))
        if (slice.length > 0) {
          slice.forEach(element => {
            resSale = resSale.filter(e => e.BRH_ID !== element)
          })
        }
        resSale.forEach(element => columnData.push(element.BRH_ID))
        data.push({
          columnName: 'สาขา/สายบริการ',
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.PSALE_AMT))
        data.push({
          columnName: 'ยอดขายปี ' + (year - 1),
          data: columnData,
          hidden: false
        })
        columnData = []
        resSale.forEach(element => columnData.push(element.TAR_SALE_AMT))
        data.push({
          columnName: 'เป้าการขาย',
          data: columnData,
          hidden: false
        })
        let result = {
          status: 'SUCCESS',
          title: 'เป้าการขาย',
          masterColumn: masterColumn,
          data: data
        }
        resolve(result)
      })
    } catch (err) {
      reject(err)
    }
  })
}

function toDate(selector) {
  var from = selector.split("-")
  return new Date(from[2], from[1] - 1, from[0])
}

export function getPayAMT(startDate, endDate, sort = 'ทีมติดตาม', filter = []) {
  // let m1 = startDate.split('-')
  // let m2 = endDate.split('-')
  // let startStr = m1[2].substring(2,4)+m1[1]
  // let endStr = m2[2].substring(2,4)+m2[1]
  // let genColumn = `IN (select to_char(sysdate, 'RRMM') from dual)`
  let mm = `'1902', '1901', '1812'`
  // let startMonth = toDate(startDate)
  // let endMonth = toDate(endDate)
  // let startStr = startMonth.getFullYear().toString().substring(2,4)+(startMonth.getMonth()+1).toString()
  // let endStr = endMonth.getFullYear().toString().substring(2,4)+(endMonth.getMonth()+1).toString()
  sort = sort === '%' ? 'ทีมติดตาม' : sort
  var slice = filter.split(',')
  // console.log(sort)
  // console.log(slice)
  // const sortOption = [
  //   { columnName: 'ทีมติดตาม', column: 'PATH_NO' },
  //   { columnName: 'เดือน', column: 'MDATE' },
  //   { columnName: 'ยอดเก็บเดือน ' + months[currentDate.getMonth()], column: 'PAY_AMT' },
  //   { columnName: 'ยอดเก็บเดือน ' + months[lastDate.getMonth()], column: 'PAY_AMT2' }
  // ]
  // const orderBy = sortOption.filter(obj => obj.columnName === sort)[0]


  return new Promise((resolve, reject) => {
    try {
      let getCol = `select FYYMM_TEXT(to_date('${startDate}', 'DD-MM-RRRR'),TO_DATE( '${endDate}', 'DD-MM-RRRR')) from dual`
      oracleExecute(getCol).then((resCol) => {
        let mm = resCol[0][Object.keys(resCol[0])]
        console.log(mm)
        let sqlstatement = `SELECT * FROM 
      (
      SELECT 
      PATH_NO || ' ' || PMAS.PATH_NAME(BRH_ID, PATH_NO) as ทีมติดตาม,
      TO_CHAR(MDATE,'YYMM') MM, 
      SUM(PAY_AMT) PAY_AMT
      FROM   SA010V 
      WHERE  BRH_ID = '66' 
        AND  MDATE BETWEEN  TRUNC(TO_DATE('${startDate}','DD/MM/RRRR'),'MM') AND TRUNC(TO_DATE('${endDate}','DD/MM/RRRR'),'MM')
      GROUP BY 
      PATH_NO || ' ' || PMAS.PATH_NAME(BRH_ID, PATH_NO),  MDATE
      )
      PIVOT 
      (
      SUM(PAY_AMT) FOR MM IN (${mm})
      )`
        oracleExecute(sqlstatement).then((resSale) => {
          console.log(resSale)
          let column = []
          column = Object.keys(resSale[0])
          let data = []
          let columnData = []
          let masterColumn = []
          resSale.forEach(element => masterColumn.push(element[column[0]]))
          if (slice.length > 0) {
            slice.forEach(element => {
              resSale = resSale.filter(e => e[column[0]] !== element)
            })
          }
          for (let i = 0; i < column.length; i++) {
            columnData = []
            resSale.forEach(element => columnData.push(element[column[i]]))
            data.push({
              columnName: column[i],
              data: columnData,
              hidden: false
            })
          }
          let result = {
            status: 'SUCCESS',
            title: 'ยอดเก็บทีมติดตาม',
            masterColumn: masterColumn,
            data: data
          }
          resolve(result)
        })
      })
    } catch (err) {
      reject(err)
    }
  })
}

function oracleExecute(sqlstatement) {
  return new Promise((resolve, reject) => {
    oracledb.getConnection(constants.database.oracle.production, (err, connection) => {
      if (err) return reject(err)
      else {
        connection.execute(sqlstatement, [], { outFormat: oracledb.OBJECT }, (error, result) => {
          if (error) return reject(error)
          else {
            connection.close()
            console.log(result.rows)
            return resolve(result.rows)
            // return resolve({
            //   status: 'SUCCESS',
            //   header: header,
            //   data: result.rows
            // })
          }
        })
      }
    })
  })
}

function oracleExecuteFunction(sqlstatement) {
  return new Promise((resolve, reject) => {
    oracledb.getConnection(constants.database.oracle.production, (err, connection) => {
      if (err) return reject(err)
      else {
        connection.execute(sqlstatement, [], { outFormat: oracledb.OBJECT }, (error, result) => {
          if (error) return reject(error)
          else {
            connection.close()
            console.log(result.rows)
            console.log(Object.keys(result.rows[0])[0])
            return resolve(result.rows)
            // return resolve({
            //   status: 'SUCCESS',
            //   header: header,
            //   data: result.rows
            // })
          }
        })
      }
    })
  })
}
