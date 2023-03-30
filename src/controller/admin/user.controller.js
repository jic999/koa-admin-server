const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const env = require('../../conf/env')
const userService = require('../../service/user.service')
const User = require('../../model/user')
const qiniu = require('../../third-party/qiniu')
const {
  UsernameNotExist,
  UsernamePasswordNotMatch,
  AccountIsDisabled,
  NoAccess,
  UsernameIsOccupied,
  UnknownUserId,
  OperateDatabaseError,
  EmailIsOccupied,
} 
= require('../../constant/errorTypes')

const selectFields = [
  'id', 'username', 'email', 'avatar', 'isVip', 'type',
  'status', 'createdAt', 'updatedAt']

class UserController {
  async login(ctx) {
    const { username, password } = ctx.request.body
    // 是否存在
    const user = await userService.getBy({ username })
    if(!user) throw new UsernameNotExist()
    // 是否管理员
    if(user.type === 0) throw new NoAccess()
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

  async createUser(ctx) {
    const { avatarFile, ...userInfo } = ctx.request.body
    // 查询用户名是否存在
    const isExist = await userService.getBy({ username: userInfo.username })
    if(isExist) throw new UsernameIsOccupied()
    // 上传 avatar
    const { url } = await qiniu.qiniuUpload(avatarFile)

    const salt = bcrypt.genSaltSync(3)
    const password = bcrypt.hashSync('123456', salt)

    const result = await userService.create({ avatar: url, password, ...userInfo })
    if(!result) throw new OperateDatabaseError()
    ctx.R('新增用户成功')
  }

  async updateUser(ctx) {
    const { avatarFile, avatar, ...userInfo } = ctx.request.body
    console.log(avatarFile, avatar);
    const user = await User.query().findOne({ id: userInfo.id })
    if(!user) throw new UnknownUserId()
    // 查询用户名和邮箱是否被占用
    if(userInfo.username && userInfo.username !== user.username) {
      const count = await userService.selectCount({ username: userInfo.username })
      if(count > 0) throw new UsernameIsOccupied()
    }
    if(userInfo.email && userInfo.email !== user.email) {
      const count = await userService.selectCount({ email: userInfo.email })
      if(count > 0) throw new EmailIsOccupied()
    }

    let newAvatar = ''
    if(avatarFile) {
      const { url } = await qiniu.qiniuUpload(avatarFile)
      userInfo.avatar = url
      newAvatar = url
    }
    const result = await userService.update(userInfo)
    if(!result) throw new OperateDatabaseError()
    ctx.R('更新成功')

    // 判断是否需要删除图片
    if(newAvatar && avatar && newAvatar !== avatar) {
      userService.selectCount({ avatar }).then((count) => {
        if(count === 0) {
          return qiniu.qiniuDelete(avatar)
        } else {
          console.log('图片使用中', avatar)
        }
      }).then((result) => {
        console.log('删除成功', avatar);
      }).catch((err) => {
        console.log('删除失败', err);
      })
    }
  }

  async deleteUser(ctx) {
    const { id } = ctx.params
    const result = await User.query().deleteById(id)
    if(!result) throw new OperateDatabaseError()
    ctx.R('删除成功')
  }

  async list(ctx) {
    const userList = await User.query().orderBy('createdAt', 'desc')
      .select(selectFields)
    ctx.R('查询成功', userList)
  }

  async page(ctx) {
    const { page, pageSize, ...queryParams } = ctx.request.body
    const result = await User.findPage(page, pageSize, queryParams)
    ctx.R('分页查询成功', result)
  }
}

module.exports = new UserController()