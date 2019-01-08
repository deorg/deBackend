import { createNews as newNews, getNews as getNew, addCategory, getCate, deleteNews as delNews,
  deleteImg as delImg, updateNews } from '../services/news'

import { getMenu, changeDate, changeMenu } from '../services/weekendFood'

export function newCatetory (req, res, next) {
  addCategory(req.body).then((resCate) => {
    if (resCate.status === 'SUCCESS') {
      res.send(resCate)
    } else {
      res.send(400).json(resCate)
    }
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function deleteImg (req, res, next) {
  delImg(req.query.name).then((resDel) => {
    if (resDel.status === 'SUCCESS') {
      res.send(resDel)
    } else {
      res.send(400).json(resDel)
    }
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function getCategory (req, res, next) {
  getCate().then((resCate) => {
    res.json({
      status: 'SUCCESS',
      data: resCate
    })
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function editNews (req, res, next) {
  // console.log(req.body.id)
  // console.log(req.body.title)
  // console.log(req.body.category)
  // console.log(req.body.startDate)
  // console.log(req.body.endDate)
  // console.log(req.body.imageName)
  // console.log(req.body.image)
  // res.status(200).send({
  //   status: 'SUCCESS',
  //   desc: 'complete'
  // })
  let update = {
    title: req.body.title,
    content: req.body.content,
    category: req.body.category,
    startDate: req.body.startDate,
    endDate: req.body.endDate,
    creator: 'admin'
  }
  updateNews(req.body.id, update, req.body.imageName, req.body.image).then((resUpdate) => {
    res.send(resUpdate)
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function createNews (req, res, next) {
  newNews(req.body).then((resNews) => {
    if (resNews.status === 'FAILURE') {
      res.status(400).json(resNews)
    } else {
      res.send(resNews)
    }
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function deleteNews (req, res, next) {
  delNews(req.body.id).then((resNews) => {
    if (resNews.status === 'FAILURE') {
      res.status(400).json(resNews)
    } else {
      res.send(resNews)
    }
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function getNews (req, res, next) {
  getNew().then((resNews) => {
    res.json({
      status: 'SUCCESS',
      data: resNews
    })
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

// WEEKEND FOOD CONTROLLERS

export function getWeekendMenu (req, res, next) {
  getMenu().then((result) => {
    res.json({
      status: 'SUCCESS',
      data: result
    })
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function editDate (req, res, next) {
  changeDate(req.body.date).then((result) => {
    res.json({
      status: 'SUCCESS',
      data: result
    })
  }).catch((err) => {
    res.status(500).json({
      status: 'FAILURE',
      desc: err
    })
  })
}

export function editMenu (req, res, next) {
  changeMenu(req.body).then((result) => {
    res.json({
      status: 'SUCCESS',
      data: result
    }).catch((err) => {
      res.status(500).json({
        status: 'FAILURE',
        desc: err
      })
    })
  })
}
