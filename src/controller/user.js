const {exec,escape} = require('../db/mysql')
const {genPassword} = require('../utils/cryp')

const login = (username,password) =>{
    username = escape(username)
    password = escape(genPassword(password))
   const sql = `SELECT username,realname FROM users WHERE username=${username} 
   AND password=${password};`

   return exec(sql).then(rows =>{
       return rows[0] || {}
   })
}

module.exports = {
    login
}