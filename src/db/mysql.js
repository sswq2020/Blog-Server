const mysql = require('mysql');
const { MYSQL_CONF } = require('../conf/db.js');

// 创建链接对象
const con = mysql.createConnection(MYSQL_CONF);

// 开始链接
con.connect()

// 统一执行sql的函数

function exec(sql) {
    return new Promise((resolve, reject) => {
        con.query(sql, (err, result) => {
            if (err) {
                reject(err)
            }
            resolve(result)
        })
    })
}

module.exports = {
    exec,
    escape:mysql.escape
}


