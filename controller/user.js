const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const xss = require('xss');

const login = (username, password) => {
    username = escape(username)
    password = escape(genPassword(password))
    const sql = `SELECT username,realname FROM users WHERE username=${username} 
   AND password=${password};`

    return exec(sql).then(rows => {
        return rows[0] || {}
    })
}

const register = async (name, realname, password) => {
    name = escape(name)
    realname = escape(realname)
    password = escape(genPassword(password))
    const sql = `SELECT username FROM users WHERE username=${name};`
    const sql2 = `INSERT INTO users (username,password,realname,state)
    values (${xss(name)},${xss(password)},${xss(realname)},0);
    `;
     
    // async...await的写法
    let rows = await exec(sql);
    if(rows[0]){
        return Promise.resolve(null)
    }else {
        let insertData = await exec(sql2);
        return Promise.resolve({id:insertData.insertId})
    }
   
    // Promise的写法
    // return exec(sql).then(rows => {
    //     console.log(rows)
    //     if (rows[0]) {
    //         return '1'
    //     } else {
    //         return null
    //     }
    // }).then(exit => {
    //     if (exit) {
    //         return null
    //     }
    //     return exec(sql2).then(insertData => {
    //         return {
    //             id: insertData.insertId
    //         }
    //     })
    // })
}





module.exports = {
    login,
    register
}