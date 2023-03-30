const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const env = require('../../conf/env')
const userService = require('../../service/user.service')
const {
  UsernameIsOccupied,
  OperateDatabaseError,
  UsernameNotExist,
  UsernamePasswordNotMatch,
  AccountIsDisabled,
} 
= require('../../constant/errorTypes')

class UserController {
  async register(ctx) {
    // 校验唯一性
    const { username, password } = ctx.request.body
    const isExist = await userService.selectCount({ username })
    if(isExist) throw new UsernameIsOccupied()
    // 密码加密
    const salt = bcrypt.genSaltSync(3)
    const newPwd = bcrypt.hashSync(password, salt)
    // 创建用户
    const result = await userService.create({ username, password: newPwd })
    if(!result) throw new OperateDatabaseError()

    ctx.R('注册成功')
  }
  async login(ctx) {
    const { username, password } = ctx.request.body
    // 是否存在
    const user = await userService.getBy({ username })
    if(!user) throw new UsernameNotExist()
    // 是否禁用
    if(user.status !== 0) throw new AccountIsDisabled()
    // 密码比对
    const { password: truePwd, ...userInfo } = user
    if(!bcrypt.compareSync(password, truePwd))
      throw new UsernamePasswordNotMatch()
    // 颁发token
    const token = jwt.sign(userInfo, env.JWT_SECRET, { expiresIn: '3d' });
    ctx.cookies.set('token', token, { httpOnly: true })
  
    ctx.R('登录成功', userInfo)
  }
  async loginStatus(ctx) {
    ctx.R('验证成功', ctx.state)
  }
}

module.exports = new UserController()