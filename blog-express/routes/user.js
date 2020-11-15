var express = require('express');
var router = express.Router();
const { login } = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')

/* GET home page. 路由如果是 '/' 执行回调*/
router.post('/login', function(req, res, next) {
    const { username, password } = req.body
    console.log(username, password)
    // const { username, password } = req.query
    const result = login(username, password)
    result.then(data => {
        console.log(data)
        if (data.username) {
            // 设置 session
            req.session.username = data.username
            req.session.realname = data.realname
            // 同步到 redis
            // set(req.sessionId, req.session)   如果有redis,express会自动同步到redis不需要手动同步

            res.json(
                new SuccessModel()
            )
            return
        }
        res.json(
            new ErrorModel('登录失败')
        )
    })
});
// router.get('/login-test', function (req, res, next) {
//     if(req.session.username) {
//         res.json({
//             errno: 0,
//             msg: '已登录'
//         })
//         return
//     }
//     res.json({
//         errno: 1,
//         msg: '未登录'
//     })
// })

module.exports = router;