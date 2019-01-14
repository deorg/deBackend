/* eslint-disable handle-callback-err */
import Album from '../models/m_album'

// const fs = require('fs-extra')

export function createAlbum (val1, val2) {
  return new Promise((resolve, reject) => {
    Album.find({}, function (err, docs) {
      var createGallery = new Album({
        name: val1.name,
        detail: val1.detail,
        date: val1.date,
        file: val2
      })
      createGallery.save(function (err, person) {
        if (err) {
          return reject(err)
        } else {
          return resolve(Promise.all([val1, val2]))
        }
      })
    })
  })
}
