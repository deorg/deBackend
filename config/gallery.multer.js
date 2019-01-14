const multer = require('multer')
const fs = require('fs-extra')

var storage = multer.diskStorage({
  destination: function (req, res, cb) {
    let name = req.body.name
    // eslint-disable-next-line no-undef
    let path = __basedir + `/assets/gallery/${name}`

    if (!fs.existsSync(path)) {
      fs.mkdirSync(path)
    }
    cb(null, path)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})
var newUpload = multer({ storage: storage })

module.exports = newUpload
