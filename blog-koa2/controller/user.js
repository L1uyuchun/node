const { exec, escape } = require('../db/mysql')


const login = async (username, password) => {
    const userName = escape(username)
    const passWord = escape(password)

    const sql = `select username, realname from users where username = ${userName} and password = ${passWord}`

    const rows = await exec(sql)
    return rows[0] || {}
}
module.exports = {
    login
}