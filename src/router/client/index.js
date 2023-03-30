const fs = require('fs')
const Router = require('koa-router')

const router = new Router('/client')

fs.readdirSync(__dirname).forEach((file) => {
  if(file !== 'index.js') {
    const routerItem = require(`./${file}`)
    router.use(routerItem.routes())
  }
})

module.exports =  router