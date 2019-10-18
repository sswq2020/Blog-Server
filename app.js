/****专门用来处理404***/
const createError = require('http-errors');
const express = require('express');
const path = require('path');
/*****解析cookie****/
const cookieParser = require('cookie-parser');
/*****日志功能****/
const logger = require('morgan');
/*****SESSION****/
const session = require("express-session")
/****创建redis的客户端***/
const redisClient =  require("./db/redis")
/****session连接redis***/
const RedisStore = require('connect-redis')(session) // 用法参照https://www.npmjs.com/package/connect-redis

const indexRouter = require('./routes/index');
const blogRouter = require('./routes/blog');
const userRouter = require('./routes/user');
/*****app可以这么理解,每次服务端监听后生成的实例****/
let app = express();

app.use(logger('dev'));
app.use(express.json()); // 通过express.json(),可以将post请求传递的参数,放入req.body中,比起原生node的getPostData函数,一行代码解决
app.use(express.urlencoded({ extended: false }));// 因为上面是接收req.headers['content-type'] === 'application/json',而没有post还有x-www-form等其他形式的,这里做这个处理
app.use(cookieParser());

/****redis的存储器***/
const sessionStore = new RedisStore({
  client:redisClient
})

app.use(session({
  secret:'SSwq_2332#',
  cookie:{
    path:'/', // 默认配置
    httpOnly:true, // 默认配置
    maxAge:10 * 60 * 1000
  },
  store:sessionStore //之前没有redis，session存在内存中,现在可以放在redis数据库里

}))

app.use('/', indexRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
