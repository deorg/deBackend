import { createNews as newNews, getNews as getNew, addCategory, getCate, deleteNews as delNews } from '../services/news'

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

