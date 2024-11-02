const env = process.env.NODE_ENV;

// if (env === 'test') {
//     require('dotenv').config({ path: '.env.test' });
// } else {
//     require('dotenv').config();
// }

module.exports = {
    [env]: {
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        host: process.env.DB_HOST,
        dialect: 'postgres',
    }
}