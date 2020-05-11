const router = require('koa-router')()

const {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
} = require("../controller/blog")
const { createSuccessData, createErrorData } = require("../model/resModel")
const loginCheck = require("../middleware/loginCheck")


router.prefix('/api/blog')

router.get('/list', async (ctx, next) => {
  let author = ctx.query.author || ""
  let keyword = ctx.query.keyword || ""
  if (ctx.query.isadmin) {
    if (!ctx.session.username) {
      ctx.body = createErrorData('未登录')
      return
    }
    author = ctx.session.username
  }
  try {
    const listData = await getList(author, keyword)
    ctx.body = createSuccessData(listData)
  } catch (error) {
    ctx.body = createErrorData(error)
  }
});

router.get('/detail', async (ctx, next) => {
  try {
    const data = await getDetail(ctx.query.id)
    ctx.body = createSuccessData(data)
  } catch (error) {
    ctx.body = createErrorData(error)
  }
});

router.post('/new', loginCheck, async (ctx, next) => {
  const body = ctx.request.body
  body.author = ctx.session.username
  try {
    const data = await newBlog(body)
    ctx.body = createSuccessData(data)
  } catch (error) {
    ctx.body = createErrorData(error)
  }
});

router.post('/update', loginCheck, async (ctx, next) => {
  const body = ctx.request.body
  body.author = ctx.session.username
  const val = await updateBlog(ctx.query.id, body)
  if (val) {
    ctx.body = createSuccessData()
  } else {
    ctx.body = createErrorData('更新失败')
  }
});
 
router.post('/del', loginCheck, async (ctx, next) => {
  const author = ctx.session.username
  const val = await delBlog(ctx.query.id, author)
  if (val) {
    ctx.body = createSuccessData()
  } else {
    ctx.body = createErrorData('删除失败')
  }
});

module.exports = router