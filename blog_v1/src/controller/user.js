const { exec, escape } = require('../db/mysql')


const login = (username, password) => {
    const userName = escape(username)
    const passWord = escape(password)

    const sql = `select username, realname from users where username = ${userName} and password = ${passWord}`

    return exec(sql).then(rows => {
        return rows[0] || {}
    })


    // if(userName === 'zhangsan' && password === '123456') {
    //     return true
    // }
    // return false
}
module.exports = {
    login
}