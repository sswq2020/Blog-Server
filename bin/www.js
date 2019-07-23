const http = require('http')
const serverHandle = require('../app.js')
const PORT = 2000
const server = http.createServer(serverHandle)
server.listen(PORT)