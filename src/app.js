const Koa = require('koa')
const logger = require('log4js').getLogger()

const router = require('./router/index')

const { responseHandler, mergeFormData, cors, koaBody, log4js } = require('./middleware/global')

const env = require('./conf/env')

const app = new Koa()

/* 全局中间件 */
app.use(cors()).use(log4js())
app.use(koaBody()).use(mergeFormData())
app.use(responseHandler())


app.use(router.routes())

app.listen(env.APP_PORT, () => {
  logger.info(`App is running at http://localhost:${env.APP_PORT}`)
})

