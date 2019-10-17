var express = require('express');
var router = express.Router();
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog
} = require("../controller/blog")
const {createSuccessData,createErrorData} = require("../model/resModel")

router.get('/list', function(req, res, next) {
    let author = req.query.author || ""
    let keyword = req.query.keyword || ""

    const result =getList(author,keyword)
    return result.then(listData =>{
       res.json(createSuccessData(listData));
    }).catch(err => {
        res.json(createErrorData(err)) ;
    })
});

module.exports = router;