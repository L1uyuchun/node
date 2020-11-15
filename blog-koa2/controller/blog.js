const { exec } = require('../db/mysql')
// const { xss } = require('xss')

const getList = async (author, keyword) => {
    let sql = `select * from blogs where 1=1 `
    if(author) {
        sql +=`and author = '${author}' `
    }
    if(keyword) {
        sql += `and title like '%${keyword}%' `
    }
    sql += `order by createtime desc`
    const result = await exec(sql)
    return result
}

const getDetail = async (id) => {
    const sql = `select * from blogs where id = '${id}'`
    const rows = await exec(sql)
    return rows[0]
}
const newBlog = async (blogData = {}) => {
    // blog是一个博客对象，包含title,content, author 属性
    const title = blogData.title
    const content = blogData.content
    const author = blogData.author
    const createTime = Date.now()

    const sql = `
      insert into blogs (title, content, createtime, author)
      values ('${title}', '${content}', ${createTime}, '${author}')
    `
    const insertData = await exec(sql)
    return {
        id: insertData.insertId
    }
    // return {
    //     id: 3
    // }
}

const updateBlog = async (id, blogData = {}) => {
    // id指的是更新博客的id
    // blogData 是一个博客对象，包含title, content 属性

    const title = blogData.title
    const content  = blogData.content

    const sql = `
       update blogs set title = '${title}', content = '${content}' where id = ${id}
    `
    const updateData = await exec(sql)
    if(updateData.affectedRows > 0) {
        return true
    }
    return false
}

const deleteBlog = async (id, author) => {
    const sql = `delete from blogs where id= ${id} and author='${author}'`
    const delData = await exec(sql)
    if(delData.affectedRows > 0) {
        return true
    }
    return false
}
module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    deleteBlog
}