const {
    getList,
    newBlog,
    getDetail,
    updateBlog,
    deleteBlog
} = require('../controller/blog')
const { SuccessModel, ErrorModel } = require('../model/resModel')
//统一登录验证函数
const loginCheck = (req) => {
    if(!req.session.username) {
        return Promise.resolve(
            new ErrorModel('尚未登录')
        )
    }
}


const handleBlogRouters = (req) => {
    const id = req.query.id || ""
    if(req.method === 'GET' && req.path ==='/api/blog/list') {
        let author = req.query.author || ''
        const keyword = req.query.keyword || ''
        // const listData = getList(author, keyword)
        // return new SuccessModel(listData)
        if(req.query.isadmin) {
            const loginCheckResult = loginCheck(req)
            if(loginCheckResult) {
                // 未登录
                return loginCheckResult
            }
            // 强制查询自己的博客
            author = req.session.username
        }


        return getList(author, keyword).then(listData => {
            return new SuccessModel(listData)
        })
     }
     if(req.method === 'GET' && req.path === '/api/blog/detail') {
          return getDetail(id).then(data => {
             return new SuccessModel(data)
         })

     }
     if(req.method === 'POST' && req.path === '/api/blog/new') {
         const loginCheckResult = loginCheck(req)
         if(loginCheckResult) {
             // 未登录
             return loginCheckResult
         }

         const resultData = newBlog(req.body)
         // console.log(resultData, 'resultData')

         req.body.author = req.session.username  //假数据
         return resultData.then(data => {
             return new SuccessModel(data)
         })

     }
     if(req.method === 'POST' && req.path === '/api/blog/update') {
         const loginCheckResult = loginCheck(req)
         if(loginCheckResult) {
             // 未登录
             return loginCheckResult
         }
         const result = updateBlog(id, req.body)
         return result.then(val => {
             if(val) {
                 return new SuccessModel('更新博客成功')
             } else {
                 return new ErrorModel('更新博客失败')
             }

         })
     }
     if(req.method === 'POST' && req.path === '/api/blog/del') {
         const loginCheckResult = loginCheck(req)
         if(loginCheckResult) {
             // 未登录
             return loginCheckResult
         }

         const author = req.session.username

         const result = deleteBlog(id, author)
         return result.then(val => {
             if(val) {
                 return new SuccessModel('删除博客成功')
             } else {
                 return new ErrorModel('删除博客失败')
             }
         })
     }
}

module.exports = handleBlogRouters