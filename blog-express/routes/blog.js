var express = require('express');
var router = express.Router();
const {
    getList,
    newBlog,
    getDetail,
    updateBlog,
    deleteBlog
} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')
const { SuccessModel, ErrorModel } = require('../model/resModel')

/* GET home page. 路由如果是 '/' 执行回调*/
router.get('/list', function(req, res, next) {
    let author = req.query.author || ''
    const keyword = req.query.keyword || ''
    if(req.query.isadmin) {
        if(!req.session.username) {
            // 未登录
            res.json(
                new ErrorModel('未登录')
            )
            return
        }
        // 强制查询自己的博客
        author = req.session.username
    }


    getList(author, keyword).then(listData => {
        res.json(
            new SuccessModel(listData)
        )
    })
});
router.get('/detail', loginCheck, (req, res, next) => {
    getDetail(req.query.id).then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
});
router.post('/new', loginCheck, (req, res, next) => {
    const resultData = newBlog(req.body)
    // console.log(resultData, 'resultData')

    // req.body.author = req.session.username  //假数据
    resultData.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
})
router.post('/update', loginCheck, (req, res, next) => {
    const result = updateBlog(req.query.id, req.body)
    result.then(val => {
        if(val) {
            res.json(
                new SuccessModel('更新博客成功')
            )
        } else {
            res.json(
                new ErrorModel('更新博客失败')
            )
        }

    })
})
router.post('/del', loginCheck, (req, res, next) => {
    const author = req.session.username

    const result = deleteBlog(req.query.id, author)
    return result.then(val => {
        if(val) {
            res.json(
                new SuccessModel('删除博客成功')
            )
        } else {
            res.json(
                new ErrorModel('删除博客失败')
            )
        }
    })
})

module.exports = router;