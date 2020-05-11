const { exec } = require('../db/mysql');
const xss = require('xss');

const getList = async (author, keyword) => {
    let sql = `SELECT * FROM blogs WHERE 1=1 `
    if (author) {
        sql += `AND author='${author}' `
    }
    if (keyword) {
        sql += `AND title LIKE '%${keyword}%' `
    }
    sql += `ORDER BY createTime DESC;`

    return await exec(sql)
}

const getDetail = async (id) => {
    const sql = `SELECT * FROM blogs WHERE id='${id}';`
    const rows = await exec(sql)
    return rows[0]
}

const newBlog = async (blogData = {}) => {
    // blogData 是一个博客对象,包含title content author属性
    const { title, content, author } = blogData;
    const createTime = Date.now();
    const sql = `INSERT INTO blogs (title,content,createtime,author)
     values ('${xss(title)}','${xss(content)}',${createTime},'${author}');
     `;
    const insertData = await exec(sql)
    return { id: insertData.insertId }
}

const updateBlog = async (id, blogData = {}) => {
    // id就是要更新的博客id
    // blogData 是一个博客对象,包含title content 属性
    const { title, content, author } = blogData
    const sql = ` UPDATE blogs SET title='${xss(title)}',content='${xss(content)}' 
    WHERE id = ${id} AND author='${author}';`
    const updateData = await exec(sql)
    if (updateData.affectedRows > 0) {
        return true
    } 
    return false
}

const delBlog = async (id, author) => {
    // id 就是要删除博客的id
    const sql = `DELETE FROM blogs WHERE id='${id}' AND author='${author}';`
    const deleteData = await exec(sql)
    if (deleteData.affectedRows > 0) {
        return true
    }
    return false
}


module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}