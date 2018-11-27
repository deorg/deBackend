import dateFormat from 'dateformat'
import News from '../models/m_news'
import Category from '../models/m_categoryNews'
import path from 'path'
import { basePath } from '../../app'
import fs from 'fs'
import Guid from 'Guid'

export function uploadImg (name, data) {
  return new Promise((resolve, reject) => {
    var base64Data = data.replace(/^data:image\/(png|gif|jpeg);base64,/, '')
    console.log(path.join(basePath, '/public/img/', name).toString())
    fs.writeFile(path.join(basePath, '/public/img/', name), base64Data, 'base64', (err) => {
      if (err) {
        console.log(err)
        reject(err)
      } else {
        resolve('Uploaded')
      }
    })
  })
}

export function getCate () {
  return new Promise((resolve, reject) => {
    Category.find({}, (err, cate) => {
      if (err) {
        return reject(err)
      } else {
        var result = []
        cate.forEach((u) => {
          result.push({
            _id: u._id,
            name: u.name,
            created_date: u.created_date
          })
        })
        resolve(result)
      }
    })
  })
}

export function getNews () {
  return new Promise((resolve, reject) => {
    News.find({}, (err, news) => {
      if (err) {
        return reject(err)
      } else {
        var result = []
        news.forEach((u) => {
          result.push({
            _id: u._id,
            title: u.title,
            content: u.content,
            category: u.category,
            startDate: u.startDate,
            endDated: u.endDate,
            image: u.image,
            created_date: u.created_date,
            creator: u.creator
          })
        })
        resolve(result)
      }
    })
  })
}

export function deleteNews (_id) {
  return new Promise((resolve, reject) => {
    News.deleteOne({ '_id': _id }, (err) => {
      if (err) {
        return reject(err)
      } else {
        return resolve({
          status: 'SUCCESS',
          desc: `News ${_id} has been deleted at ${dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')}`
        })
      }
    })
  })
}

export function updateNews (_id, data) {
  return new Promise((resolve, reject) => {
    News.findOneAndUpdate({ '_id': _id }, data, { upsert: false }, (err, doc) => {
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

export function addCategory (value) {
  return new Promise((resolve, reject) => {
    var catetory = new Category(value)
    var date = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
    catetory.name = value.name
    catetory.created_date = date
    catetory.save((err) => {
      if (err) {
        return reject(err)
      } else {
        var result = {
          status: 'SUCCESS',
          desc: `Category ${catetory.name} has been created at ${catetory.created_date}`
        }
        return resolve(result)
      }
    })
  })
}

export function createNews (value) {
  console.log(value.title)
  console.log(value.content)
  console.log(value.category)
  console.log(value.startDate)
  console.log(value.endDate)
  let startDate = new Date(value.startDate)
  let endDate = new Date(value.endDate)
  console.log(startDate)
  return new Promise((resolve, reject) => {
    var news = new News(value)
    var date = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
    news.title = value.title
    news.content = value.content
    news.category = value.category
    news.startDate = dateFormat(startDate, 'yyyy-mm-dd HH:MM:ss')
    news.endDate = dateFormat(endDate, 'yyyy-mm-dd HH:MM:ss')
    news.image = Guid.raw() + '.png'
    news.created_date = date
    news.creator = value.creator
    news.save((err) => {
      if (err) {
        console.log(err)
        return reject(err)
      } else {
        uploadImg(news.image, value.image).then((resSave) => {
          var result = {
            status: 'SUCCESS',
            desc: `News ${news.title} has been created at ${news.created_date}`
          }
          return resolve(result)
        })
      }
    })
  })
}
