var express = require('express');
var router = express.Router();
const { login } = require("../controller/user")
const { createSuccessData, createErrorData } = require("../model/resModel")


router.post('/login', function (req, res, next) {
    const { username, password } = req.body;
    const result = login(username, password)
    return result.then(data => {
        if (data.username) {
            req.session.username = data.username
            req.session.realname = data.realname
            res.json(createSuccessData('登录成功'))
            return
        }
        res.json(createErrorData('登录失败'))
    })
});

module.exports = router;