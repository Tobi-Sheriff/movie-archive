const env = process.env.NODE_ENV || 'development';

if (env === 'test') {
    require('dotenv').config({ path: '.env.test' });
} else {
    require('dotenv').config();
}

module.exports = {
    [env]: {
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres',
        database: process.env.DB_NAME || 'movie_db_test',
        host: process.env.DB_HOST || 'localhost',
        dialect: 'postgres',
    }
}