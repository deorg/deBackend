import dateFormat from 'dateformat'
import User from '../models/m_user'
import { hashSync } from 'bcrypt-nodejs'

export function getUser () {
  return new Promise((resolve, reject) => {
    User.find({}, (err, users) => {
      if (err) {
        return reject(err)
      } else {
        var result = []
        users.forEach((u) => {
          result.push({
            role_id: u.role_id,
            username: u.username,
            firstname: u.firstname,
            lastname: u.lastname,
            department: u.department,
            created_dt: u.created_date,
            modified_dt: u.updated_date
          })
        })
        resolve(result)
      }
    })
  })
}

export function deleteUser (username) {
  return new Promise((resolve, reject) => {
    User.deleteOne({ 'username': username }, (err) => {
      if (err) {
        return reject(err)
      } else {
        return resolve({
          status: 'SUCCESS',
          desc: `User ${username} has been deleted at ${dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')}`
        })
      }
    })
  })
}

export function updateUser (username, data) {
  return new Promise((resolve, reject) => {
    User.findOneAndUpdate({ 'username': username }, data, { upsert: false }, (err, doc) => {
      if (err) {
        reject(err)
      } else {
        var result = {
          status: 'SUCCESS',
          data: doc
        }
        resolve(result)
      }
    })
  })
}

export function newUser (value) {
  return new Promise((resolve, reject) => {
    var user = new User(value)
    User.findOne({ username: value.username }, (err, users) => {
      if (err) {
        return reject(err)
      }
      if (users) {
        return resolve({
          status: 'FAILURE',
          desc: 'This username has been used!'
        })
      } else {
        var date = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
        user.password = user.generateHash(value.password)
        user.firstname = value.firstname
        user.lastname = value.lastname
        user.department = value.department
        user.role_id = value.role_id
        user.created_date = date
        user.updated_date = date
        user.active_hash = hashSync(Math.floor((Math.random() * 99999999) * 54), null, null)
        user.save((err) => {
          if (err) {
            return reject(err)
          } else {
            var result = {
              status: 'SUCCESS',
              desc: `User ${user.username} has been created at ${user.created_date}`
            }
            return resolve(result)
          }
        })
      }
    })
  })
}
