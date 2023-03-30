const jwt = require('jsonwebtoken')

const env = require('../conf/env')
const {
  InvalidToken,
  NoAccess,
} = require('../constant/errorTypes')

class UserMiddleware {
  /* User */
  async auth(ctx, next) {
    const token = ctx.cookies.get('token')
    // TODO token续签
    try {
      const user = jwt.verify(token, env.JWT_SECRET)
      Object.assign(ctx.state, user)
    } catch (err) {
      throw new InvalidToken()
    }
    await next()
  }
  /* Admin */
  async authorizeAdmin(ctx, next) {
    if(ctx.state.type === 0) throw new NoAccess()
    await next()
  }
}

module.exports = new UserMiddleware()