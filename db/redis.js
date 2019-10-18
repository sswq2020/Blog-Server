const redis = require("redis");
const {REDIS_CONF} = require('../conf/db.js')

//创建客户端
const redisClicent = redis.createClient(REDIS_CONF.port,REDIS_CONF.host)
redisClicent.on('error',err=>{
    console.log(err);
})

module.exports =redisClicent;