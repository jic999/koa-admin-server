const User = require('../model/user')

const adminAllowedFields = ['id', 'username', 'email', 'avatar',
  'isVip', 'type', 'status', 'createdAt', 'updatedAt']

class UserService {

  async selectCount(user) {
    let query = User.query()
    Object.keys(user).forEach((key) => {
      query = query.where(key, user[key])
    })
    return await query.resultSize()
  }
  async getBy(user) {
    return await User.query().findOne(user)
  }
  async create(user) {
    return await User.query().insert(user)
  }
  async update(user) {
    return await User.query().findById(user.id).patch(user)
  }
  async list() {
    return await User.query()
    .orderBy('createdAt', 'desc')
    .select(adminAllowedFields)
  }
  async page(page, pageSize) {
    return await User.findPage(page, pageSize, (query) => {
      query.select(adminAllowedFields)
    })
  }
}

module.exports = new UserService()