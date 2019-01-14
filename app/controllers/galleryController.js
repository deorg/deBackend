import { createAlbum, oldAlbum, deletePic, deleteGallery, getData } from '../services/gallery'

const newUpload = require('../../config/gallery.multer')
const oldUpload = require('../../config/oldGallery.multer')

export function newGallery (req, res) {
  newUpload.any()(req, res, function () {
    createAlbum(req.body, req.files).then(([result1, result2]) => {
      res.json({
        status: 'SUCCESS',
        details: result1,
        files: result2
      })
    }).catch((err) => {
      res.status(500).json({
        status: 'FAILURE',
        desc: err
      })
    })
  })
}

export function addImage (req, res) {
  oldUpload.any()(req, res, function () {
    oldAlbum(req.body.name, req.files).then((result) => {
      res.json({
        status: 'SUCCESS',
        insert: result
      }).catch((err) => {
        res.status(500).json({
          status: 'FAILURE',
          desc: err
        })
      })
    })
  })
}

export function removePic (req, res) {
  console.log(req.body, 'aaaaaaaa')
  deletePic(req.body.name, req.body.filename).then((result) => {
    res.json({
      status: 'SUCCESS',
      insert: result
    })
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function removeGallery (req, res) {
  deleteGallery(req.body.name).then((result) => {
    res.json({
      status: 'SUCCESS',
      insert: result
    })
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function getAlbums (req, res) {
  getData().then((result) => {
    res.json({
      status: 'SUCCESS',
      data: result
    })
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}
