const router = require('express').Router()
const Articles = require('../models').articlesModel

router.use((req, res, next) => {
  console.log('请求到达 Articles-route')
  next()
})

// 创建文章
router.post('/create', async (req, res) => {
  console.log(req.body)
  const newArticle = new Articles({
    content: req.body.content,
    title: req.body.title,
    tags: req.body.tags
  })
  console.log(newArticle)
  try {
    const savedArticle = await newArticle.save()
    res.status(200).send({
      msg: '添加成功',
      savedObject: savedArticle
    })
  } catch (err) {
    res.status(400).send('创建文章失败')
  }
})
// 分页获取文章
router.get('/', async (req, res) => {
  console.log(req.query)
  const page = Number(req.query.page) // 第几页数据
  const per_page = Number(req.query.per_page) //一页显示几条数据
  const total = await Articles.find({}).countDocuments()
  const results = await Articles.find({})
    .skip((page - 1) * per_page)
    .limit(per_page)
  const pages = Math.ceil(total / per_page)
  if (results) {
    res.send({
      data: {
        page: page,
        per_page: per_page,
        results,
        total_count: total,
        pages: pages
      },
      message: 'OK'
    })
  }
})
// 根据条件筛选文章(暂时不用)
router.get('/filter', async (req, res) => {
  console.log(req.query)
  const channelId = req.query.channel_id
  const status = req.query.status
  // 如果状态和频道都选择全部时，搜索所有商品
  if (status === '-1' && channelId === '-1') {
    const total = await Articles.find({}).countDocuments()
    const results = await Articles.find({})
    if (!results) {
      res.status(404)
      return res.json({
        success: false,
        message: '没有找到该文章'
      })
    } else {
      res.status(200).send({
        data: {
          results,
          total_count: total
        },
        message: 'OK'
      })
    }
    // 当状态选择全部，而频道不是全部时
  } else if (status === '-1') {
    const total = await Articles.find({
      channel_id: channelId
    }).countDocuments()
    let results = await Articles.find({ channel_id: channelId })
    if (!results) {
      res.status(404)
      return res.json({
        success: false,
        message: '没有找到该文章'
      })
    } else {
      res.status(200).send({
        data: {
          results,
          total_count: total
        },
        message: 'OK'
      })
    }
    // 当频道为全部时，根据状态进行搜索
  } else if (channelId === '-1') {
    const total = await Articles.find({
      status: status
    }).countDocuments()
    let results = await Articles.find({ status: status })
    if (!results) {
      res.status(404)
      return res.json({
        success: false,
        message: '没有找到该文章'
      })
    } else {
      res.status(200).send({
        data: {
          results,
          total_count: total
        },
        message: 'OK'
      })
    }
  } else {
    const total = await Articles.find({
      $and: [{ channel_id: channelId }, { status: status }]
    }).countDocuments()
    let results = await Articles.find({
      $and: [{ channel_id: channelId }, { status: status }]
    })
    if (!results) {
      res.status(404)
      return res.json({
        success: false,
        message: '没有找到该文章'
      })
    } else {
      res.status(200).send({
        data: {
          results,
          total_count: total
        },
        message: 'OK'
      })
    }
  }
})
// 根据 id 获取文章
router.get('/search/:id', async (req, res) => {
  // 验证文章是否存在
  let { id } = req.params
  let article = await Articles.findOne({ id })
  if (!article) {
    res.status(404)
    return res.json({
      success: false,
      message: '没有找到该文章'
    })
  } else {
    res.status(200).send(article)
  }
})
// 更新文章
router.patch('/:id', async (req, res) => {
  let { id } = req.params
  Articles.findOneAndUpdate({ id }, req.body, {
    new: true,
    runValidators: true
  })
    .then(() => {
      res.send('课程更新成功！')
    })
    .catch((e) => {
      res.send({
        success: false,
        message: e
      })
    })
})
// 删除文章
router.delete('/:id', async (req, res) => {
  // 验证文章是否存在
  let { id } = req.params

  let article = await Articles.findOne({ id })
  if (!article) {
    res.status(404)
    return res.json({
      success: false,
      message: '没有找到该文章'
    })
  } else {
    Articles.deleteOne({ id })
      .then(() => {
        res.send('文章删除成功！')
      })
      .catch((e) => {
        res.send({
          sucess: false,
          message: e
        })
      })
  }
})
module.exports = router
