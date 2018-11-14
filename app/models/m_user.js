import mongoose from 'mongoose'
import { hashSync, genSaltSync, compareSync } from 'bcrypt-nodejs'

var userSchema = mongoose.Schema({
  username: String,
  password: String,
  firstname: String,
  lastname: String,
  department: String,
  role_id: { type: Number, default: 2 },
  created_date: Date,
  updated_date: Date,
  active_hash: String
})
// methods ======================
// generating a hash
userSchema.methods.generateHash = function (password) {
  return hashSync(password, genSaltSync(8), null)
}

// checking if password is valid
userSchema.methods.validPassword = function (password) {
  return compareSync(password, this.password)
}

// create the model for users and expose it to our app
export default mongoose.model('users', userSchema, 'User')
