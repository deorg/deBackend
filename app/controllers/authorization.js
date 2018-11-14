import { getUser, newUser, updateUser, deleteUser as delUser } from '../services/user'
import jwt from 'jsonwebtoken'

const tokenForUser = (user) => {
  return jwt.sign({ subj: { user: user._id } }, 'Demestic MIS', { expiresIn: '30m' })
}

export function createUser (req, res, next) {
  newUser(req.body).then((resUser) => {
    if (resUser.status === 'FAILURE') {
      res.status(400).json(resUser)
    } else {
      res.send(resUser)
    }
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function deleteUser (req, res, next) {
  console.log('----------------------------------')
  console.log(req.query.username)
  delUser(req.query.username).then((resDelete) => {
    res.send(resDelete)
  }).catch((err) => {
    res.send(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function getAllUser (req, res, next) {
  getUser().then((resUser) => {
    res.send(resUser)
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function updateUserData (req, res, next) {
  let update = {
    username: req.body.newUsername,
    password: req.body.password,
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    department: req.body.department,
    role_id: req.body.role_id
  }
  updateUser(req.body.oldUsername, update).then((resUpdate) => {
    res.send(resUpdate)
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function signInUser (req, res, next) {
  res.json({ success: true, token: tokenForUser(req.user) })
}
