const router = require('koa-router')()

const { login, register } = require("../controller/user")
const { createSuccessData, createErrorData } = require("../model/resModel")

router.prefix('/api/user')

router.post('/login', async (ctx, next) => {
  const { username, password } = ctx.request.body;
  const data = await login(username, password)

  if (data.username) {
    ctx.session.username = data.username
    ctx.session.realname = data.realname
    ctx.body = createSuccessData('登录成功')
    return
  }
  ctx.body = createErrorData('登录失败')
});

router.post('/register', async (ctx, next) => {
  const { name, realname, password } = ctx.request.body;
  const data = await register(name, realname, password)
  if (data) {
    ctx.body = createSuccessData('注册成功')
    return
  }
  ctx.body = createErrorData('注册失败')
});


module.exports = router