const Router = require('koa-router')

const userValidator = require('../../middleware//validator/user.validator')
const userController = require('../../controller/admin/user.controller')
const router = new Router({ prefix: '/user' })

const { auth, authorizeAdmin } = require('../../middleware/user.middleware')

router.post('/login', userValidator.loginAndSignIn, userController.login)

router.post('/login-status', auth, authorizeAdmin, userController.loginStatus)

router.post('/', auth, authorizeAdmin, userValidator.create, userController.createUser)

router.put('/', auth, authorizeAdmin, userValidator.update, userController.updateUser)

router.delete('/:id', auth, authorizeAdmin, userValidator.delete, userController.deleteUser)

router.get('/list', auth, authorizeAdmin, userController.list)

router.post('/page', auth, authorizeAdmin, userValidator.page, userController.page)

// TODO 照片墙上传接口

module.exports = router
