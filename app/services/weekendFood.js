import menu from '../models/m_foodWeekend'

export function getMenu () {
  return new Promise((resolve, reject) => {
    menu.find({}, (err, docs) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(docs)
      }
    })
  })
}

export function changeDate (val) {
  return new Promise((resolve, reject) => {
    menu.update({}, { $set: { date: val } }, { upsert: false }, (err, docs) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(docs)
      }
    })
  })
}

export function changeMenu (val) {
  return new Promise((resolve, reject) => {
    menu.updateMany({}, { $push: { 'menu': val } }, (err, docs) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(docs)
      }
    })
  })
}
