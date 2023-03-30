const cors = require('@koa/cors')
const allowOrigins = ['http://localhost:5173'];


module.exports = () => {
  return cors({
    origin: (ctx) => {
      const origin = ctx.request.header.origin
      if(allowOrigins.includes(origin))
      return origin
      return false
    },
    credentials: true,
  })
}