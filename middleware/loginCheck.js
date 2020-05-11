const {createErrorData} = require('../model/resModel')

module.exports = async (ctx, next) =>{
    if(ctx.session.username) {
        await next()
        return 
    }
    ctx.body = createErrorData("未登录")
}