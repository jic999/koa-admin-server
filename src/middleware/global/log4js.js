const log4js = require('log4js')

log4js.configure({
  appenders: {
    console: { type: 'console' },
  },
  categories: { default: { appenders: ['console'], level: 'debug' } }
});

module.exports = function() {
  return async function(ctx, next) {
    ctx.logger = log4js.getLogger('app');
    const startTime = Date.now()
    await next()
    const responseTime = Date.now() - startTime
    // 记录请求来源的信息
    ctx.logger.info(`${ctx.method} ${ctx.url} from ${ctx.ip} - ${ctx.status} - ${responseTime}ms - ${ctx.headers['user-agent']}`);
  };
}