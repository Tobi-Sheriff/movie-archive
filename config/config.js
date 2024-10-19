require('dotenv').config(process.env.NODE_ENV === 'test' ? {path: '.env.test'} : {path: '.env'});

module.exports = {

  development: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'movie_db_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  test: {
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.TEST_DB_NAME || 'movie_db_test',
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
  },
  production: {
    username: "root",
    password: null,
    database: "database_production",
    host: "127.0.0.1",
    dialect: "postgres"
  }
}
