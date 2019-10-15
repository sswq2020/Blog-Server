var createError = require('http-errors');
var express = require('express');
var path = require('path');
/*****解析cookie****/
var cookieParser = require('cookie-parser');
/*****日志功能****/
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
/*****app可以这么理解,每次服务端监听后生成的实例****/
var app = express();

app.use(logger('dev'));
app.use(express.json()); // 通过express.json(),可以将post请求传递的参数,放入req.body中,比起原生node的getPostData函数,一行代码解决
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
