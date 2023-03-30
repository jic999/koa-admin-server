const Joi = require('joi')

const { joiValidator } = require('./index')

const usernameReg = /^[a-z]+[\da-z]*/

const id = Joi.number().min(1)
const username = Joi.string().pattern(usernameReg)
const password = Joi.string().min(6).max(16)
const avatar = Joi.string()
const email = Joi.string().email().optional()
const isVip = Joi.number().valid(0, 1)
const type = Joi.number().valid(0, 1, 9)
const status = Joi.number().valid(0, -1)

const avatarImg = Joi.object({
  mimetype: Joi.string().valid('image/png', 'image/jpeg'),
}).unknown(true)

class UserValidator {
  loginAndSignIn = joiValidator(Joi.object({
    username: username.required(),
    password: password.required(),
  }))
  create = joiValidator(Joi.object({
    username: username.required(),
    avatarFile: avatarImg.required(),
    email,
    isVip,
    type,
    status,
  }))
  update= joiValidator(Joi.object({
    id: id.required(),
    username,
    avatar,
    avatarFile: avatarImg,
    email,
    isVip,
    type,
    status,
  }))
  delete = joiValidator(Joi.object({
    id: id.required(),
  }), 'params')
  page = joiValidator(Joi.object({
    page: Joi.number(),
    pageSize: Joi.number(),
  }).unknown(true))
}

module.exports = new UserValidator()