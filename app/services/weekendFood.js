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
    menu.update({}, { $set: { date: new Date(val) } }, { upsert: false }, (err, docs) => {
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

export function deleteMenu () {
  return new Promise((resolve, reject) => {
    menu.update({}, { $set: { menu: [] } }, (err, docs) => {
      if (err) {
        return reject(err)
      } else {
        return resolve(docs)
      }
    })
  })
}
