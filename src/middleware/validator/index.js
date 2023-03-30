const Joi = require('joi')

const { InvalidArgument } = require('../../constant/errorTypes')

module.exports = {
  joiValidator(rules, type = 'body') {
    return async (ctx, next) => {
      const params = ctx.request[type]
      if(!params) throw new InvalidArgument()
      const schema = rules
      const { error } = schema.validate(params)
      if (error) throw new InvalidArgument(error.message)
      await next()
    }
  },
  // TODO fileValidator
}