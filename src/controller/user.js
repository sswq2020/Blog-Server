const {exec,escape} = require('../db/mysql')

const login = (username,password) =>{
    username = escape(username)
    password = escape(password)
   const sql = `SELECT username,realname FROM users WHERE username=${username} 
   AND password=${password};`

   return exec(sql).then(rows =>{
       return rows[0] || {}
   })
}

module.exports = {
    login
}