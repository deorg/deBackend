const multer = require('multer')

const storageOldGal = multer.diskStorage({
  destination: function (req, res, cb) {
    let name = req.body.name
    // eslint-disable-next-line no-undef
    let path = __basedir + `/assets/gallery/${name}`

    cb(null, path)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

const oldUpload = multer({ storage: storageOldGal })

module.exports = oldUpload
