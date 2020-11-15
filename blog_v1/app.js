const querystring = require('querystring')
const handleBlogRouters = require('./src/router/blog')
const handleUsersRouter = require('./src/router/user')
const { set, get } = require('./src/db/redis')
const { access } = require("./src/utils/log")

// 获取 cookie 的过期时间
const getCookieExpires = () => {
    const d = new Date()
    d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
    return d.toGMTString()
}
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        try {
            if(req.method !== 'POST') {
                resolve({})
                return
            }
            if(req.headers['content-type'] !== 'application/json') {
                resolve({})
                return
            }
            let postData = ''
            req.on('data', chunk => {
                postData +=chunk.toString()
            })
            req.on('end', () => {
                if(!postData) {
                    resolve({})
                    return
                }
                resolve(
                    JSON.parse(postData)
                )
            })
        } catch (e) {
            reject(e)
        }

    })
    return promise
}

const serverHandle = (req, res) => {
    // 记录访问日志
    access(`${req.method}--${req.url}--${req.headers['user-agent']}--${Date.now()}`)


    //设置返回格式json
    res.setHeader('Content-type', 'application/json')
    const method = req.method
    const url = req.url
    req.path = url.split('?')[0]
    req.query = querystring.parse(url.split('?')[1])

    //解析cookie
    req.cookie = {}
    const cookieStr = req.headers.cookie || ""
    cookieStr.split(';').forEach(item => {
        if(!item) {
            return
        }
        const arr = item.split("=")
        const key = arr[0]
        const val = arr[1]
        req.cookie[key] = val
    })

    // 解析 session （使用 redis）
    let needSetCookie = false
    let userId = req.cookie.userid
    if (!userId) {
        needSetCookie = true
        userId = `${Date.now()}_${Math.random()}`
        // 初始化 redis 中的 session 值
        set(userId, {})
    }

    // 获取 session
    req.sessionId = userId
    get(req.sessionId).then(sessionData => {
        console.log(sessionData, 'sessionData');
        if (sessionData == null) {
            // 初始化 redis 中的 session 值
            set(req.sessionId, {})
            // 设置 session
            req.session = {}
        } else {
            // 设置 session
            req.session = sessionData
        }
        // console.log('req.session ', req.session)

        // 处理 post data
        return getPostData(req)
    })
        .then(postData => {
        req.body = postData

        const blogResult = handleBlogRouters(req, res)
        if(blogResult) {
            blogResult.then(blogData => {
                if (needSetCookie) {
                    res.setHeader('Set-Cookie', `userid=${userId}; path=/; httpOnly; expires=${getCookieExpires()}`)
                }
                res.end(
                    JSON.stringify(blogData)
                )
            })
            return
        }
        const userData = handleUsersRouter(req)
        if(userData) {
            userData.then(userData => {
                res.end(
                    JSON.stringify(userData)
                )
            })
            return

        }

        //没有匹配到路由就显示404
        res.writeHead(404, { "content-type": "text/plain" })
        res.write('404 Not Fount\n')
        res.end()
    })





}
module.exports = serverHandle