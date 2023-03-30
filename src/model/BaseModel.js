const { Model } = require('../db/index')

class BaseModel extends Model {
  static get timestamps() {
    return true;
  }

  static async findPage(page, pageSize, queryParams = {}, builderFn = (query) => query) {
    const query = builderFn(this.query());
    Object.keys(queryParams).forEach((key) => {
      const value = queryParams[key]
      query.where(key, 'like', `%${value}%`)
    })
    const total = await query.resultSize();
    const { results } = await query.range((page - 1) * pageSize, page * pageSize - 1);
    const totalPage = Math.ceil(total / pageSize)
    return {
      page,
      pageSize,
      total,
      totalPage,
      records: results,
    };
  }

  $beforeInsert() {
    if (this.constructor.timestamps) {
      this.createdAt = new Date().toLocaleString();
      this.updatedAt = new Date().toLocaleString();
    }
  }

  $beforeUpdate() {
    if (this.constructor.timestamps) {
      this.updatedAt = new Date().toLocaleString();
    }
  }

}

module.exports = BaseModel