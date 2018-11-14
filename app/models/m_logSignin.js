import mongoose from 'mongoose'

var logSigninSchema = mongoose.Schema({
  type: String,
  user: String,
  ipAddress: String,
  success: Boolean,
  note: String,
  log_dt: Date,
  signing_at: Date
})

// create the model for users and expose it to our app
export default mongoose.model('logSignin', logSigninSchema, 'LogSignin')
