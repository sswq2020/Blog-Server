// 密匙
const SECRET_KEY = 'SSwq_2332#'
// crypto模块的目的是为了提供通用的加密和哈希算法
const crypto = require('crypto');

//md5加密
function md5(content){
    let hash = crypto.createHash('md5')
    return hash.update(content).digest('hex')
}

// 加密函数
function genPassword(password) {
    const str = `password=${password}&key={SECRET_KEY}`
    return md5(str);
}

console.log(genPassword(678))

module.exports= {
    genPassword
}