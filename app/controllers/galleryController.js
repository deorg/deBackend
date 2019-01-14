import { createAlbum } from '../services/gallery'

const newUpload = require('../../config/gallery.multer')

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
