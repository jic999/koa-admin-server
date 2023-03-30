const Knex = require('knex');
const { Model, knexSnakeCaseMappers  } = require('objection');

const env = require('../conf/env')

const knex = Knex({
  client: 'mysql2',
  connection: {
    host : env.MYSQL_HOST,
    port : env.MYSQL_PORT,
    user : env.MYSQL_USER,
    password : env.MYSQL_PWD,
    database : env.MYSQL_DB,
  },
  ...knexSnakeCaseMappers({ upperCase: true })
});
Model.knex(knex),

module.exports = {
  knex,
  Model,
}