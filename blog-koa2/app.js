const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')  //转换成json格式
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser') //处理pos请求中的body参数
const logger = require('koa-logger')  //日志
const session = require('koa-generic-session')
const redisStore = require('koa-redis')
const { REDIS_CONF } = require('./config/db')
const path = require('path')
const fs = require('fs')
const morgan = require('koa-morgan')



// const index = require('./routes/index')  //路由
// const users = require('./routes/users')
const blog = require('./routes/blog')
const user = require('./routes/user')

app.keys = ['keys']  //session加密key值
app.use(session({
  cookie: {
    key: 'blog',  //cookie name default: koa.sid
    path: '/',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, //one day in ms,
    overwrite: true,
    signed: true
  },
  store: redisStore({
    // Options specified here
    //     all: '127.0.0.1:6379' //default value
      all: `${REDIS_CONF.host}:${REDIS_CONF.port}`
      }
  )
}));



// error handler
onerror(app)

// middlewares ，处理post请求的参数，支持处理多种格式
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views', {
  extension: 'pug'
}))

// logger  记录每个事件执行花费的时间
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

const ENV = process.env.NODE_ENV
if(ENV ==='dev') {// 开发环境记录日志
  app.use(morgan('dev', {
    stream: process.stdout   //默认配置，日志的输出流配置 //输出到控制台上
  }));
} else {
  const logFileName = path.join(__dirname, 'logs', 'access.log')
  const writeStream = fs.createWriteStream(logFileName, {
    flags: 'a'
  })
  app.use(morgan('combined', {
    stream: writeStream  //写入到对应的文件中
  }))
}

// routes  .allowedMethods处理的业务是当所有路由中间件执行完成之后,若ctx.status为空或者404的时候,
// 丰富response对象的header头.
// app.use(index.routes(), index.allowedMethods())
// app.use(users.routes(), users.allowedMethods())
app.use(blog.routes(), blog.allowedMethods())
app.use(user.routes(), blog.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
