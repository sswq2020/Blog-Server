const {createErrorData} = require('../model/resModel')

module.exports = (req,res,next) =>{
    if(req.session.username) {
        next()
        return 
    }
    res.json(createErrorData("未登录"))
}