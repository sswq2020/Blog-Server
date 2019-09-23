const querystring = require('querystring')
const { get, set } = require('./src/db/redis')
const {access} = require('./src/utils/log')
const handleBlogRouter = require('./src/router/blog')
const handleUserRouter = require('./src/router/user')

// 获取 cookie 的过期时间
const getCookieExpires = () => {
   const d = new Date()
   d.setTime(d.getTime() + (24 * 60 * 60 * 1000))
   return d.toGMTString()
}

// 用于处理post data
const getPostData = (req) => {
   return new Promise((resolve, reject) => {
      if (req.method !== 'POST') {
         resolve({})
         return
      }
      if (req.headers['content-type'] !== 'application/json') {
         resolve({})
         return
      }
      let postData = ''
      req.on('data', chunk => {
         postData += chunk.toString()
      })
      req.on('end', () => {
         if (!postData) {
            resolve({})
            return
         }
         resolve(
            JSON.parse(postData)
         )
      })
   })
}

const serverHandle = (req, res) => {
   // 记录access log
   access(`${req.method} -- ${req.url} -- ${req.headers['user-agent']} -- ${Date.now()}`)

   //设置返回格式
   res.setHeader('Content-type', 'application/json')

   // 获取query
   const url = req.url
   req.path = url.split('?')[0]

   // 解析query
   req.query = querystring.parse(url.split('?')[1])

   // 解析cookie
   req.cookie = {}
   const cookieStr = req.headers.cookie || "" // ka=v1;k2=v2;
   cookieStr.split(";").forEach(item => {
      if (!item) {
         return
      }
      const arr = item.split('=')
      const key = arr[0];
      const val = arr[1];
      req.cookie[key] = val;
   });

   // 解析session (使用redis)
   let userId = req.cookie.userid
   let needSetCookie = false
   if (!userId) {
      needSetCookie = true
      userId = `${Date.now()}_${Math.random()}`
      // 初始化redis 中的session 值
      set(userId, {})
   }

   // 获取session
   req.sessionId = userId
   get(req.sessionId).then(sessionData => {
      if (sessionData == null) {
         // 初始化redis 中的 session 值
         set(req.sessionId, {})
         // 设置 session
         req.session = {}
      } else {
         req.session = sessionData
      }
      console.log('req.session', req.session)

      // 处理post data
      return getPostData(req)
   }).then(postData => {
      req.body = postData;
      const blogResult = handleBlogRouter(req, res)
      if (blogResult) {
         blogResult.then(blogData => {
            if (needSetCookie) {
               res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${(getCookieExpires())}`)
            }
            res.end(
               JSON.stringify(blogData)
            )
         })
         return
      }

      const userResult = handleUserRouter(req, res);
      if (userResult) {
         userResult.then(userData => {
            if (needSetCookie) {
               res.setHeader('Set-Cookie', `userid=${userId};path=/;httpOnly;expires=${getCookieExpires()}`)
            }
            res.end(
               JSON.stringify(userData)
            )
         })
         return
      }

      // 未命中返回404
      res.writeHead(404, { "Content-type": "text/plain" })
      res.write("404 Not Found")
      res.end()

   })
}

module.exports = serverHandle

// process.env.NODE_ENVB