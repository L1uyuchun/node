const env = process.env.NODE_ENV

let MYSQL_CONF
let REDIS_CONF

if (env === 'development') {
    //开发环境连接本地数据库
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'myblog'
    }
    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}

if(env === 'production') {
    //开发环境连接生产的数据库，此时没有就暂时连接本地
    // mysql
    MYSQL_CONF = {
        host: 'localhost',
        user: 'root',
        password: '123456',
        port: '3306',
        database: 'myblog'
    }
    // redis
    REDIS_CONF = {
        port: 6379,
        host: '127.0.0.1'
    }
}
module.exports = {
    MYSQL_CONF,
    REDIS_CONF
}