import mongoose from 'mongoose'

var newsSchema = mongoose.Schema({
  title: String,
  content: String,
  category: String,
  startDate: Date,
  endDate: Date,
  image: String,
  created_date: Date,
  creator: String
})
// create the model for users and expose it to our app
export default mongoose.model('news', newsSchema, 'News')
