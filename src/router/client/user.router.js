const Router = require('koa-router')

const userValidator = require('../../middleware//validator/user.validator')
const userController = require('../../controller/client/user.controller')
const router = new Router({ prefix: '/user' })

const { auth } = require('../../middleware/user.middleware')


router.post('/register', userValidator.loginAndSignIn, userController.register)

router.post('/login', userValidator.loginAndSignIn, userController.login)

router.post('/login-status', auth, )

module.exports = router