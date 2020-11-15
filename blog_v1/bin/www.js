const http = require('http')

const PORT = 8000

const serverHandle = require('../app')

const server = http.createServer(serverHandle)

server.listen(PORT, function() {
  console.log("服务器已经启动")
})