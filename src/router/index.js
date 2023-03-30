const fs = require('fs')
const path = require('path')

const Router = require('koa-router')

const router = new Router()

const folders = fs.readdirSync(__dirname).filter((file) => 
  fs.statSync(path.join(__dirname, file)).isDirectory()
)

folders.forEach((dir) => {
  const filePath = `./${dir}/index.js`
  const routerItem = require(filePath)
  router.use(routerItem.routes())
})

module.exports = router