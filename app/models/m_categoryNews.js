import mongoose from 'mongoose'

var categoryNewsSchema = mongoose.Schema({
  name: String,
  created_date: Date
})
// create the model for users and expose it to our app
export default mongoose.model('categoryNews', categoryNewsSchema, 'CategoryNews')
