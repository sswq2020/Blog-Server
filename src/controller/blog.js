const {exec} = require('../db/mysql');
const xss = require('xss');

const getList = (author,keyword) =>{
    let sql = `SELECT * FROM blogs WHERE 1=1 `
    if (author) {
        sql += `AND author='${author}' ` 
    }
    if (keyword) {
        sql += `AND title LIKE '%${keyword}%' `
    }
    sql += `ORDER BY createTime DESC;`
    
    // 返回 promise
    return exec(sql)
}

const getDetail = (id) =>{
    const sql = `SELECT * FROM blogs WHERE id='${id}';`
    return exec(sql).then(rows =>{
        return rows[0]
    })
}

const newBlog = (blogData = {}) =>{
    // blogData 是一个博客对象,包含title content author属性
  const {title,content,author} = blogData;
  const createTime = Date.now();
  const sql = `INSERT INTO blogs (title,content,createtime,author)
     values ('${xss(title)}','${xss(content)}',${createTime},'${author}');
     `;
  return exec(sql).then(insertData =>{
      return {
          id:insertData.insertId
      }
  })
}

const updateBlog = (id,author,blogData = {}) =>{
    // id就是要更新的博客id
    // blogData 是一个博客对象,包含title content 属性
    const {title,content} = blogData
    const sql = ` UPDATE blogs SET title='${xss(title)}',content='${xss(content)}' 
    WHERE id = ${id} AND author='${author}';`  
    return exec(sql).then(updateData =>{
        console.log(updateData);
        if(updateData.affectedRows > 0) {
            return true
        }
        return false
    })
}

const delBlog = (id, author) =>{ 
    // id 就是要删除博客的id
    const sql = `DELETE FROM blogs WHERE id='${id}' AND author='${author}';`
    return exec(sql).then(deleteData =>{
        if(deleteData.affectedRows > 0) {
            return true
        }
        return false
    })
}


module.exports = {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
}