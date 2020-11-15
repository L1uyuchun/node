var createError = require('http-errors'); // 处理404没有找到的路由
var express = require('express');
var path = require('path');
var fs = require('fs')
var cookieParser = require('cookie-parser'); //解析cookied的库，有了它可以直接在注册后通过req.cookie得到解析后的cookie
var logger = require('morgan');  // access log 自动记录日志
var session = require('express-session')
var RedisStore = require('connect-redis')(session)
var redisClient = require('./db/redis')

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
var blogRouter = require('./routes/blog')
var userRouter = require('./routes/user')

var app = express();

// view engine setup // 注册一个前端页面引擎设置，注释
// app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const ENV = process.env.NODE_ENV
if(ENV ==='development') {// 开发环境记录日志
  app.use(logger('dev', {
    stream: process.stdout   //默认配置，日志的输出流配置 //输出到控制台上
  }));
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(logger('combined', {
    stream: writeStream  //写入到对应的文件中
  }))
}

app.use(express.json()); //express.json() 类似于处理post请求中传递的data数据，application/json格式的数据 req.body就可以直接拿到data数据
app.use(express.urlencoded({ extended: false }));  //解析其它的data数据格式
app.use(cookieParser());  // 后续可以直接req.cookies访问cookie
// app.use(express.static(path.join(__dirname, 'public')));  //静态文件，前端页面文件
app.use(session({
  secret: 'keyboard cat',  //session加密的密匙的作用
  resave: false,  //强制保存 session 即使它并没有变化,。默认为 true。建议设置成 false。 don't save session if unmodified
  saveUninitialized: true,   //强制将未初始化的 session 存储。当新建了一个 session 且未设定属性或值时，它就处于
                      // 未初始化状态。在设定一个 cookie 前，这对于登陆验证，减轻服务端存储压力，权限控制是有帮助的。(默 认:true)。建议手动添加。
  cookie:{
    ath: '/',   //根目录，作用于所有的页面
    httpOnly: true, //设置为true,前端不能通过document.cookie访问
    maxAge: 24*60*60*1000  //传入session失效的时间，这里设置为24小时
  },
  store: new RedisStore({ client: redisClient }),
}))


// 注册路由
// app.use('/', indexRouter);
// app.use('/users', usersRouter);
app.use('/api/blog', blogRouter);
app.use('/api/user', userRouter);

// catch 404 and forward to error handler，没有对应的路由返回404
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler  //程序有问题抛出500错误
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
