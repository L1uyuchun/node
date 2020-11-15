const { SuccessModel } = require('../model/resModel')
const { ErrorModel } = require('../model/resModel')

const loginCheck = (req, res, next) => {
    console.log(req.session.username, 'username')
    if(req.session.username) {
       next() //执行下一个中间件
       return
   }
   res.json(
       new ErrorModel('未登录')
   )
}
module.exports = loginCheck