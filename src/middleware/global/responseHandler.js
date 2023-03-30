const responseHandler = () => {
  return async (ctx, next) => {
    try {
      ctx.R = (msg, data) => (ctx.body = { msg, data })
      await next();
      // handle 404
      if (ctx.status === 404) {
        ctx.body = { code: 404, msg: 'Not Found', data: null };
        return;
      }
      const msg = ctx.msg || 'success';
      ctx.body = {
        code: 0,
        msg: ctx.body.msg || msg,
        data: ctx.body.data || null
      }
    } catch (err) {
      ctx.logger.warn(`Failed to process request - ${err}`)
      ctx.status = 201
      // 根据需要进行错误处理
      ctx.body = { code: -1, msg: err.message, data: null };
    }
  }
}

module.exports = responseHandler