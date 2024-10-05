const knex = require('knex');
const knexConfig = require('../knexfile');

const db = knex(knexConfig.test);

beforeAll(async () => {
  // You can run migrations or setup code here
  await db.migrate.latest();
  // await db.seed.run();
  await db.seed.run({ specific: 'populate_movies_and_comments.js' }); // Run specific seed file
});

afterAll(async () => {
  // Close the database connection
  await db.destroy();
});

module.exports = db;
