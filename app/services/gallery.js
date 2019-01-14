/* eslint-disable no-undef */
/* eslint-disable handle-callback-err */
import Album from '../models/m_album'

const fs = require('fs-extra')

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

export function oldAlbum (val1, val2) {
  return new Promise((resolve, reject) => {
    Album.findOneAndUpdate({ 'name': val1 }, { $push: { 'file': val2 } }, (err, docs) => {
      if (err) {
        return reject(err)
      } resolve(docs)
    })
  })
}

export function deletePic (name, filename) {
  return new Promise((resolve, reject) => {
    console.log(name)
    console.log(filename)
    // eslint-disable-next-line no-undef
    fs.remove(__basedir + `/assets/gallery/${name}/${filename}`).then(() => {
      Album.update({ 'name': name }, { $pull: { 'file': { 'filename': filename } } }, (err, docs) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(docs)
        }
      })
    }).catch(err => {
      return reject(err)
    })
  })
}

export function deleteGallery (name) {
  return new Promise((resolve, reject) => {
    fs.remove(__basedir + `/assets/gallery/${name}`).then(() => {
      Album.remove({ 'name': name }, (err, docs) => {
        if (err) {
          return reject(err)
        } else {
          return resolve(docs)
        }
      }).catch(err => {
        return reject(err)
      })
    })
  })
}

export function getData () {
  return new Promise((resolve, reject) => {
    Album.find({}, function (err, docs) {
      if (err) {
        return reject(err)
      } else {
        return resolve(docs)
      }
    }).catch((err) => {
      return reject(err)
    })
  })
}
