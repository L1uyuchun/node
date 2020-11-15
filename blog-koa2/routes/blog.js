const router = require('koa-router')()
const { ErrorModel, SuccessModel } = require('../model/resModel')
const {
    getList,
    newBlog,
    getDetail,
    updateBlog,
    deleteBlog
} = require('../controller/blog')
const loginCheck = require('../middleware/loginCheck')

router.prefix('/api/blog')
// router.get('/', async (ctx, next) => {
//     await ctx.render('index', {
//         title: 'Hello Koa 2!'
//     })
// })

router.get('/list', async (ctx, next) => {
       let author = ctx.query.author || ''
      const keyword = ctx.query.keyword || ""
    if(ctx.query.admin) {
        if(!ctx.session.username) {
            ctx.body = new ErrorModel('未登录')
            return
        }
        author = ctx.session.username
    }
    const listData = await getList(author, keyword)
    ctx.body = new SuccessModel(listData)

})

router.get('/detail', loginCheck, async (ctx, next) => {
    const data = await getDetail(ctx.query.id)
    ctx.body = new SuccessModel(data)
});


router.post('/new', loginCheck, async (ctx, next) => {
    const data = await newBlog(ctx.request.body)
    // console.log(resultData, 'resultData')

    // req.body.author = req.session.username  //假数据
    ctx.body = new SuccessModel(data)
})
router.post('/update', loginCheck, async (ctx, next) => {
    const result = await updateBlog(ctx.query.id, req.request.body)
    if(result) {
        ctx.body =  new SuccessModel('更新博客成功')
    } else {
        ctx.body =  new ErrorModel('更新博客失败')
    }
})
router.post('/del', loginCheck, async (ctx, next) => {
    const author = ctx.session.username

    const result = await deleteBlog(req.query.id, author)
    if(result) {
        res.json(
            new SuccessModel('删除博客成功')
        )
    } else {
        res.json(
            new ErrorModel('删除博客失败')
        )
    }
})


module.exports = router