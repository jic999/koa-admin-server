const Router = require('koa-router')

const router = new Router({ prefix: '/upload'})

const { qiniuUploadToken } = require('../../third-party/qiniu')
const { auth, authorizeAdmin } = require('../../middleware/user.middleware')
const env = require('../../conf/env')
const action = 'https://up-z2.qiniup.com/'

router.get('/qiniu-token', auth, authorizeAdmin, async (ctx, next) => {
  const uploadToken = qiniuUploadToken({
    scope: env.QINIU_BUCKET,
    saveKey: `admin-test/\${etag}\${ext}`
  })
  ctx.R('获取成功', { action, uploadToken, domain: env.QINIU_DOMAIN})
})

module.exports = router