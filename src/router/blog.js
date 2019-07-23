

const { getList, getDetail, newBlog, updateBlog, delBlog } = require('../controller/blog')
const { SuccessModel, ErrorModel } = require("../model/resModel")


// 统一的登录验证函数
const loginCheck = (req) => {
    if (!req.session.username) {
        return Promise.resolve(new ErrorModel('尚未登录'))
    }
}



const handleBlogRouter = (req, res) => {
    const method = req.method
    const path = req.path
    const id = req.query.id

    //获取博客列表
    if (method === 'GET' && path === '/api/blog/list') {
        const author = req.query.author || ''
        const keyword = req.query.keyword || ''
        const result = getList(author, keyword)
        return result.then(listData => {
            return new SuccessModel(listData)
        })

    }

    //获取博客详情
    if (method === 'GET' && path === '/api/blog/detail') {
        const result = getDetail(id)
        return result.then(detail => {
            return new SuccessModel(detail)
        })

    }

    //新建博客
    if (method === 'POST' && path === '/api/blog/new') {
        const loginCheckResult = loginCheck(req);
        if(loginCheckResult) {
            // 未登录
            return loginCheck
        }
        req.body.author = req.session.username
        const blogData = req.body
        const result = newBlog(blogData)
        return result.then(data => {
            return new SuccessModel(data)
        })

    }

    //编辑博客
    if (method === 'POST' && path === '/api/blog/update') {
        const loginCheckResult = loginCheck(req);
        if(loginCheckResult) {
            // 未登录
            return loginCheck
        }
        const blogData = req.body
        const result = updateBlog(id, blogData)
        return result.then(val => {
            if (val) {
                return new SuccessModel("")
            } else {
                return new ErrorModel('更新博客失败')
            }
        })
    }

    //删除博客 
    if (method === 'POST' && path === '/api/blog/del') {
        const loginCheckResult = loginCheck(req);
        if(loginCheckResult) {
            // 未登录
            return loginCheck
        }

        const author =  req.session.username
        const result = delBlog(id, author)
        return result.then(val => {
            if (val) {
                return new SuccessModel("")
            } else {
                return new ErrorModel('删除博客失败')
            }
        })
    }

}

module.exports = handleBlogRouter;