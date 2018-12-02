import mongoose from 'mongoose'

var albumSchema = mongoose.Schema({
  name: String,
  image: [],
  created_dt: String
})
// create the model for users and expose it to our app
export default mongoose.model('album', albumSchema, 'Album')
