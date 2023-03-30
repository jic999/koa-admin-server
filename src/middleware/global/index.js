const fs = require('fs')


const modules = {}
fs.readdirSync(__dirname).forEach((file) => {
  if(file !== 'index.js') {
    const middleware = require(`./${file}`)
    modules[file.replace('.js', '')] = middleware
  }
})

module.exports = modules