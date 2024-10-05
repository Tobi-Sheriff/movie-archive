/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex('comments').del();
  await knex('movies').del();

  // Insert movie data
  await knex('movies').insert([
    // {id 1, title: 'The Shawshank Redemption', image: '(image link)', year: 1994, genres: ['Drama'], likes: 100, ratigs: '9.2', director: 'Frank Darabont', top_cast: 'Tim Robbins, Morgan Freeman', overview: 'Two imprisoned men bondover anumber of years...', trailer: '(trailer link)' },
    // {d 2, tile: 'The Godfather', image: '(image link)', year: 1972, genres: ['Crime', 'Drama'], likes: 150, ratings: '9.2, irector 'Francis Ford Coppola', top_cast: 'Marlon Brando, Al Pacino', overview: 'The aging patriarch of an orgazed crime dynasty...', trailer: '(trailer link)' },
    {
      id: 1,
      title: "The Shawshank Redemption",
      image: "(link unavailable)",
      year: 1994,
      genres: ["Drama"],
      likes: 100,
      ratings: "9.20",
      director: "Frank Darabont",
      top_cast: "Tim Robbins, Morgan Freeman",
      overview: "Two imprisoned men bond over a number of years...",
      trailer: "(trailer link)"
    },
    {
      id: 2,
      title: "The Godfather",
      image: "(link unavailable)",
      year: 1972,
      genres: ["Crime", "Drama"],
      likes: 150,
      ratings: "9.20",
      director: "Francis Ford Coppola",
      top_cast: "Marlon Brando, Al Pacino",
      overview: "The aging patriarch of an organized crime dynasty...",
      trailer: "(trailer link)"
    },
    {
      id: 3,
      title: "The Dark Knight",
      image: "(link unavailable)",
      year: 2008,
      genres: ["Action", "Thriller"],
      likes: 200,
      ratings: "9.00",
      director: "Christopher Nolan",
      top_cast: "Christian Bale, Heath Ledger",
      overview: "When the menace known as the Joker wreaks havoc...",
      trailer: "(trailer link)"
    },
    {
      id: 4,
      title: "12 Angry Men",
      image: "(link unavailable)",
      year: 1957,
      genres: ["Drama"],
      likes: 50,
      ratings: "9.00",
      director: "Sidney Lumet",
      top_cast: "Henry Fonda, Martin Balsam",
      overview: "A jury holdout attempts to prevent a miscarriage of justice...",
      trailer: "(trailer link)"
    },
    {
      id: 5,
      title: "Schindlers List",
      image: "(link unavailable)",
      year: 1993,
      genres: ["Biography", "Drama", "History"],
      likes: 100,
      ratings: "8.90",
      director: "Steven Spielberg",
      top_cast: "Liam Neeson, Ben Kingsley",
      overview: "In German-occupied Poland during World War II...",
      trailer: "(trailer link)"
    },
    {
      id: 6,
      title: "The Lord of the Rings: The Return of the King",
      image: "(link unavailable)",
      year: 2003,
      genres: ["Adventure", "Fantasy"],
      likes: 200,
      ratings: "8.90",
      director: "Peter Jackson",
      top_cast: "Elijah Wood, Viggo Mortensen",
      overview: "Gandalf and Aragorn lead the World of Men against Saurons army...",
      trailer: "(trailer link)"
    },
    {
      id: 7,
      title: "Pulp Fiction",
      image: "(link unavailable)",
      year: 1994,
      genres: ["Crime", "Drama"],
      likes: 150,
      ratings: "8.80",
      director: "Quentin Tarantino",
      top_cast: "John Travolta, Samuel L. Jackson",
      overview: "The lives of two mob hitmen, a boxer, a pair of diner bandits...",
      trailer: "(trailer link)"
    },
    {
      id: 8,
      title: "The Lord of the Rings: The Fellowship of the Ring",
      image: "(link unavailable)",
      year: 2001,
      genres: ["Adventure", "Fantasy"],
      likes: 200,
      ratings: "8.80",
      director: "Peter Jackson",
      top_cast: "Elijah Wood, Viggo Mortensen",
      overview: "A hobbit, a wizard, a dwarf, and a human embark on a quest...",
      trailer: "(trailer link)"
    },
    {
      id: 9,
      title: "duplicate1",
      image: "(link unavailable)",
      year: 1000,
      genres: ["duplicate"],
      likes: 100,
      ratings: "1",
      director: "duplicate",
      top_cast: "duplicate",
      overview: "duplicate...",
      trailer: "(trailer link)"
    },
    {
      id: 10,
      title: "duplicate2",
      image: "(link unavailable)",
      year: 1000,
      genres: ["diffDuplicate"],
      likes: 100,
      ratings: "1",
      director: "duplicate",
      top_cast: "duplicate",
      overview: "duplicate...",
      trailer: "(trailer link)"
    }
    // Add more movie entries...
  ]);

  // Insert comment data
  await knex('comments').insert([
    // {id 1, movie_id: 1, author: 'movie critic', content: 'A thought-provoking movie.', created_at: knex.fn.now() },
    // {d 2, ovie_id: 2, author: 'Fantastic man', content: 'An absolute classic!', created_at: knex.fn.now() },
    {
      id: 1,
      movie_id: 3,
      author: "moie critic",
      content: "Mind-bending action movie.",
      created_at: knex.fn.now()
    },
    {
      id: 2,
      movie_id: 1,
      author: "Fantastic man",
      content: "A thought-provoking sci-fi movie.",
      created_at: knex.fn.now()
    },
    {
      id: 3,
      movie_id: 8,
      author: "uo and down",
      content: "I need more movies like this.",
      created_at: knex.fn.now()
    },
    {
      id: 4,
      movie_id: 10,
      author: "action lamb",
      content: "Next part please.",
      created_at: knex.fn.now()
    },
    {
      id: 5,
      movie_id: 5,
      author: "common man",
      content: "This makes it my 10th watch today.",
      created_at: knex.fn.now()
    },
    {
      id: 6,
      movie_id: 3,
      author: "InceptionFan2",
      content: "I hate movies like this.",
      created_at: knex.fn.now()
    },
    {
      id: 7,
      movie_id: 10,
      author: "InceptionFan2",
      content: "Too much action.",
      created_at: knex.fn.now()
    },
    {
      id: 8,
      movie_id: 1,
      author: "Fan boy",
      content: "This makes it my 100th watch today.",
      created_at: knex.fn.now()
    },
    {
      id: 9,
      movie_id: 10,
      author: "Miami",
      content: "Do a cartoon version please...",
      created_at: knex.fn.now()
    },
    {
      id: 10,
      movie_id: 10,
      author: "Loona",
      content: "The best this month so far.",
      created_at: knex.fn.now()
    },
    // Add more comment entries...
  ]);
};
