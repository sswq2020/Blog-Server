var express = require('express');
var router = express.Router();
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require("../controller/blog")
const { createSuccessData, createErrorData } = require("../model/resModel")
const loginCheck = require("../middleware/loginCheck")


router.get('/list', (req, res, next) => {
    let author = req.query.author || ""
    let keyword = req.query.keyword || ""
    if (req.query.isadmin) {
        if (!req.session.username) {
            res.json(createErrorData('未登录'))
            return
        }
        author = req.session.username
    }
    const result = getList(author, keyword)
    return result.then(listData => {
        res.json(createSuccessData(listData));
    }).catch(err => {
        res.json(createErrorData(err));
    })
});

router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id)
    return result.then(data => {
        res.json(createSuccessData(data));
    }).catch(err => {
        res.json(createErrorData(err));
    })
});

router.post('/new', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = newBlog(req.body)
    return result.then(data => {
        res.json(createSuccessData(data));
    }).catch(err => {
        res.json(createErrorData(err));
    })
});

router.post('/update', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = updateBlog(req.query.id,req.body)
    return result.then(val => {
        if (val) { 
            res.json(createSuccessData(val));
        }else {
            res.json(createErrorData('更新失败'));
        }
    })
});

router.post('/del', loginCheck, (req, res, next) => {
    req.body.author = req.session.username
    const result = delBlog(req.query.id,req.body.author)
    return result.then(val => {
        if (val) { 
            res.json(createSuccessData(val));
        }else {
            res.json(createErrorData('删除失败'));
        }
    })
});




module.exports = router;