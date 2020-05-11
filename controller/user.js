const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const xss = require('xss');

const login = async (username, password) => {
    username = escape(username)
    password = escape(genPassword(password))
    const sql = `SELECT username,realname FROM users WHERE username=${username} 
   AND password=${password};`
   const rows = await exec(sql);
   return rows[0] || {}
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
        return null
    }else {
        let insertData = await exec(sql2);
        return {id:insertData.insertId}
    }
}


module.exports = {
    login,
    register
}