const router = require('koa-router')()
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

router.prefix('/api/user')

router.post('/login', async function (ctx, next) {
    const { username, password } = ctx.request.body
    const result = await login(username, password)
    if(result.username) {
        ctx.session.username = result.username
        ctx.session.realname = result.realname
        ctx.body = new SuccessModel('登录成功')
        return
    }
    ctx.body = new SuccessModel('登录失败')
})

module.exports = router
