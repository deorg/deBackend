import mongoose from 'mongoose'

var MenuSchema = mongoose.Schema({
  date: String,
  menu: [{ name: String, img: String }]
})

export default mongoose.model('menu', MenuSchema, 'MondayMenu')
