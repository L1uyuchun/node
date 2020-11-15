const { SuccessModel } = require('../model/resModel')
const { ErrorModel } = require('../model/resModel')

const loginCheck = async (ctx, next) => {
    if(ctx.session.username) {
       await next() //执行下一个中间件
       return
   }
    ctx.body = new ErrorModel('未登录')
}
module.exports = loginCheck