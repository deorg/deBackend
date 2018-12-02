import dateFormat from 'dateformat'
import Album from '../models/m_album'
import path from 'path'
import { basePath } from '../../app'
import fs from 'fs'
import fsPath from 'fs-path'
import Guid from 'Guid'

export function uploadImg (albumName, imageName, imageData) {
  return new Promise((resolve, reject) => {
    fsPath.mkdir(path.join(basePath, '/public/img/', albumName), (err) => {
      if (err) {
        console.log(err)
      } else {
        for (let i = 0; i < imageName.length; i++) {
          console.log('---------------- watch image ----------------')
          console.log(imageName.length)
          console.log(imageData[i])
          let base64Data = imageData[i].replace(/^data:image\/(png|gif|jpeg);base64,/, '')
          fs.writeFile(path.join(basePath, '/public/img/', albumName, imageName[i]), base64Data, 'base64', (err) => {
            if (err) {
              console.log(err)
              reject(err)
            }
          })
        }
        resolve('Uploaded')
      }
    })
    // var base64Data = data.replace(/^data:image\/(png|gif|jpeg);base64,/, '')
    // console.log(path.join(basePath, '/public/img/', name).toString())
    // fsPath.writeFile(path.join(basePath, '/public/img/', name), base64Data, 'base64', (err) => {
    //   if (err) {
    //     console.log(err)
    //     reject(err)
    //   } else {
    //     resolve('Uploaded')
    //   }
    // })
  })
}

export function addAlbum (value) {
  return new Promise((resolve, reject) => {
    var album = new Album(value)
    var date = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
    album.name = value.name
    album.created_date = date
    let image = []
    for (let i = 0; i < value.image.length; i++) {
      image.push(Guid.raw() + '.png')
    }
    album.image = image
    album.save((err) => {
      if (err) {
        console.log(err)
        return reject(err)
      } else {
        uploadImg(album.name, album.image, value.image).then((resSave) => {
          var result = {
            status: 'SUCCESS',
            desc: `Album ${album.name} has been created at ${album.created_date}`
          }
          return resolve(result)
        })
      }
    })
  })
}

export function deleteImg (name) {
  return new Promise((resolve, reject) => {
    fs.unlink(path.join(basePath, '/public/img/', name), (err) => {
      if (err) throw err

      let result = {
        status: 'SUCCESS',
        desc: name + ' was deleted'
      }
      return resolve(result)
    })
  })
}

// export function getCate () {
//   return new Promise((resolve, reject) => {
//     Category.find({}, (err, cate) => {
//       if (err) {
//         return reject(err)
//       } else {
//         var result = []
//         cate.forEach((u) => {
//           result.push({
//             _id: u._id,
//             name: u.name,
//             created_date: u.created_date
//           })
//         })
//         resolve(result)
//       }
//     })
//   })
// }

// export function getNews () {
//   return new Promise((resolve, reject) => {
//     News.find({}, (err, news) => {
//       if (err) {
//         return reject(err)
//       } else {
//         var result = []
//         news.forEach((u) => {
//           result.push({
//             _id: u._id,
//             title: u.title,
//             content: u.content,
//             category: u.category,
//             startDate: u.startDate,
//             endDate: u.endDate,
//             image: u.image,
//             created_date: u.created_date,
//             creator: u.creator
//           })
//         })
//         resolve(result)
//       }
//     })
//   })
// }

// export function deleteNews (_id) {
//   return new Promise((resolve, reject) => {
//     News.findOne({ '_id': _id }, (error, news) => {
//       if (error) {
//         return reject(error)
//       }
//       if (news) {
//         fs.unlinkSync(path.join(basePath, '/public/img/', news.image))
//         News.deleteOne({ '_id': _id }, (err) => {
//           if (err) {
//             return reject(err)
//           } else {
//             return resolve({
//               status: 'SUCCESS',
//               desc: `News ${_id} has been deleted at ${dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')}`
//             })
//           }
//         })
//       }
//     })
//   })
// }

// export function updateNews (_id, data, imageName, image) {
//   return new Promise((resolve, reject) => {
//     News.findOneAndUpdate({ '_id': _id }, data, { upsert: false }, (err, doc) => {
//       if (err) {
//         reject(err)
//       } else {
//         if (imageName != null && image != null) {
//           fs.unlink(path.join(basePath, '/public/img/', imageName), (err) => {
//             if (err) throw err

//             var base64Data = image.replace(/^data:image\/(png|gif|jpeg);base64,/, '')
//             fs.writeFile(path.join(basePath, '/public/img/', imageName), base64Data, 'base64', (errr) => {
//               if (errr) throw errr

//               var result = {
//                 status: 'SUCCESS',
//                 data: doc
//               }
//               resolve(result)
//             })
//           })
//         } else {
//           var result = {
//             status: 'SUCCESS',
//             data: doc
//           }
//           resolve(result)
//         }
//       }
//     })
//   })
// }

// export function createNews (value) {
//   console.log(value.title)
//   console.log(value.content)
//   console.log(value.category)
//   console.log(value.startDate)
//   console.log(value.endDate)
//   let startDate = new Date(value.startDate)
//   let endDate = new Date(value.endDate)
//   console.log(startDate)
//   return new Promise((resolve, reject) => {
//     var news = new News(value)
//     var date = dateFormat(Date.now(), 'yyyy-mm-dd HH:MM:ss')
//     news.title = value.title
//     news.content = value.content
//     news.category = value.category
//     news.startDate = dateFormat(startDate, 'yyyy-mm-dd HH:MM:ss')
//     news.endDate = dateFormat(endDate, 'yyyy-mm-dd HH:MM:ss')
//     news.image = Guid.raw() + '.png'
//     news.created_date = date
//     news.creator = value.creator
//     news.save((err) => {
//       if (err) {
//         console.log(err)
//         return reject(err)
//       } else {
//         uploadImg(news.image, value.image).then((resSave) => {
//           var result = {
//             status: 'SUCCESS',
//             desc: `News ${news.title} has been created at ${news.created_date}`
//           }
//           return resolve(result)
//         })
//       }
//     })
//   })
// }
