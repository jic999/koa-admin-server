const { koaBody } = require('koa-body')

module.exports = () => {
  return koaBody({
    multipart: true,
    formidable: {
      maxFileSize: 100 * 1024 * 1024    // 设置上传文件大小最大限制，默认2M
    }
  })
}
