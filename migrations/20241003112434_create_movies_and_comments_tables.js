/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
      .createTable('movies', (table) => {
        table.increments('id').primary(); // Auto-incrementing ID
        table.string('title').notNullable();
        table.string('image').notNullable();
        table.integer('year').notNullable();
        table.specificType('genres', 'text ARRAY'); // Array of genres
        table.integer('likes').defaultTo(0);
        table.decimal('ratings', 3, 2); // For ratings like 9.20
        table.string('director').notNullable();
        table.string('top_cast').notNullable();
        table.text('overview').notNullable();
        table.string('trailer').notNullable();
      })
      .createTable('comments', (table) => {
        table.increments('id').primary(); // Auto-incrementing ID
        table
          .integer('movie_id')
          .unsigned()
          .notNullable()
          .references('id')
          .inTable('movies') // Foreign key linking to the movies table
          .onDelete('CASCADE'); // If a movie is deleted, its comments are also deleted
        table.string('author').notNullable();
        table.text('content').notNullable();
        table.timestamp('created_at').defaultTo(knex.fn.now());
      });
  };
  
  /**
   * @param { import("knex").Knex } knex
   * @returns { Promise<void> }
   */
  exports.down = function (knex) {
    return knex.schema
      .dropTableIfExists('comments')
      .dropTableIfExists('movies');
  };
  