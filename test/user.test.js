const User = require('../src/model/user')

describe('--- User', () => {
  it('Create', async () => {
    const user = { username: 'qwe004', password: '123456' }
    const isExist  = await User.query().findOne({ username: user.username })
    if(!isExist) {
      const result = await User.query().insert(user)
      console.log('inserted', result)
    }
    console.log('isExist', isExist)
  });
  it('Create Batch', async () => {
    const users = [
      { username: 'qwe101', password: '123456' },
      { username: 'qwe102', password: '123456' },
      { username: 'qwe103', password: '123456' },
    ]
    const isExist = await User.query().findOne({ username: users[0].username })
    console.log('isExist', isExist)
    if(!isExist) {
      const result = await User.query().insertGraph(users)
      console.log(result);
    }
  })
  it('Update', async () => {
    const id = 10
    const username = 'qwe101'
    const rows = await User.query().findById(id)
      .patch({ password: '123123' })
    console.log('rows', rows)
  })
  it('Update Batch', async () => {
    const ids = [9, 10, 11]
    const result = await User.query().patch({ isVip: 1 })
      .whereIn('id', ids)
    console.log('result', result)
  })
  it('Delete', async () => {
    const id = 5
    const result = await User.query().deleteById(id)
    console.log('result', result)
  })
  it('Delete Batch', async () => {
    const ids = [3, 4, 5]
    const result = await User.query().delete().whereIn('id', ids)
    console.log('result', result)
  })
  it('Select Page', async () => {
    const users = await User.findPage(1, 3, (query) => {
      return query.select('id', 'username')
    })
    console.log('users', users.records);
  })
});