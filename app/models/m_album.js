import mongoose from 'mongoose'

var albumSchema = mongoose.Schema({
  name: String,
  detail: String,
  date: Date,
  file: [{
    fieldname: String,
    originalname: String,
    encoding: String,
    mimetype: String,
    destination: String,
    filename: String,
    path: String,
    size: Number
  }]
})
// create the model for users and expose it to our app
export default mongoose.model('Album', albumSchema, 'Album')
