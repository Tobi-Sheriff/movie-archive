const request = require('supertest');
const app = require('../index');
const MovieService = require('../movieServices');

// const dataStorage = process.env.DATASTORAGE;
const movieService = new MovieService();


// let setupDone = false;
beforeEach(async () => {
  await movieService.initializeMovies();
  await movieService.initializeComments();

});
afterEach(async () => {
  await movieService.destroyCommentsDB();
  await movieService.destroyMoviesDB();
});

// Movie list API Test
describe('Get Movies API', () => {
  it('Should return a paginated list of movies for page 1 limit 6', async () => {
    const response = await request(app).get('/v1/movies?page=1&limit=6');
    const pagedResponse = {
      response: [
        {
          "id": 1,
          "title": "The Shawshank Redemption",
          "image": "(link unavailable)",
          "year": 1994,
          "genres": ["Drama"],
          "likes": 100,
          "ratings": "9.20",
          "director": "Frank Darabont",
          "top_cast": "Tim Robbins, Morgan Freeman",
          "overview": "Two imprisoned men bond over a number of years...",
          "trailer": "(trailer link)"
        },
        {
          "id": 2,
          "title": "The Godfather",
          "image": "(link unavailable)",
          "year": 1972,
          "genres": ["Crime", "Drama"],
          "likes": 150,
          "ratings": "9.20",
          "director": "Francis Ford Coppola",
          "top_cast": "Marlon Brando, Al Pacino",
          "overview": "The aging patriarch of an organized crime dynasty...",
          "trailer": "(trailer link)"
        },
        {
          "id": 3,
          "title": "The Dark Knight",
          "image": "(link unavailable)",
          "year": 2008,
          "genres": ["Action", "Thriller"],
          "likes": 200,
          "ratings": "9.00",
          "director": "Christopher Nolan",
          "top_cast": "Christian Bale, Heath Ledger",
          "overview": "When the menace known as the Joker wreaks havoc...",
          "trailer": "(trailer link)"
        },
        {
          "id": 4,
          "title": "12 Angry Men",
          "image": "(link unavailable)",
          "year": 1957,
          "genres": ["Drama"],
          "likes": 50,
          "ratings": "9.00",
          "director": "Sidney Lumet",
          "top_cast": "Henry Fonda, Martin Balsam",
          "overview": "A jury holdout attempts to prevent a miscarriage of justice...",
          "trailer": "(trailer link)"
        },
        {
          "id": 5,
          "title": "Schindlers List",
          "image": "(link unavailable)",
          "year": 1993,
          "genres": ["Biography", "Drama", "History"],
          "likes": 100,
          "ratings": "8.90",
          "director": "Steven Spielberg",
          "top_cast": "Liam Neeson, Ben Kingsley",
          "overview": "In German-occupied Poland during World War II...",
          "trailer": "(trailer link)"
        },
        {
          "id": 6,
          "title": "The Lord of the Rings: The Return of the King",
          "image": "(link unavailable)",
          "year": 2003,
          "genres": ["Adventure", "Fantasy"],
          "likes": 200,
          "ratings": "8.90",
          "director": "Peter Jackson",
          "top_cast": "Elijah Wood, Viggo Mortensen",
          "overview": "Gandalf and Aragorn lead the World of Men against Saurons army...",
          "trailer": "(trailer link)"
        }
      ]
    };
    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(pagedResponse.response);
  });

  it('Should return a paginated list of movies for page 2 limit 4', async () => {
    const response = await request(app).get('/v1/movies?page=2&limit=4');
    const pagedResponse = {
      response: [
        {
          "id": 5,
          "title": "Schindlers List",
          "image": "(link unavailable)",
          "year": 1993,
          "genres": ["Biography", "Drama", "History"],
          "likes": 100,
          "ratings": "8.90",
          "director": "Steven Spielberg",
          "top_cast": "Liam Neeson, Ben Kingsley",
          "overview": "In German-occupied Poland during World War II...",
          "trailer": "(trailer link)"
        },
        {
          "id": 6,
          "title": "The Lord of the Rings: The Return of the King",
          "image": "(link unavailable)",
          "year": 2003,
          "genres": ["Adventure", "Fantasy"],
          "likes": 200,
          "ratings": "8.90",
          "director": "Peter Jackson",
          "top_cast": "Elijah Wood, Viggo Mortensen",
          "overview": "Gandalf and Aragorn lead the World of Men against Saurons army...",
          "trailer": "(trailer link)"
        },
        {
          "id": 7,
          "title": "Pulp Fiction",
          "image": "(link unavailable)",
          "year": 1994,
          "genres": ["Crime", "Drama"],
          "likes": 150,
          "ratings": "8.80",
          "director": "Quentin Tarantino",
          "top_cast": "John Travolta, Samuel L. Jackson",
          "overview": "The lives of two mob hitmen, a boxer, a pair of diner bandits...",
          "trailer": "(trailer link)"
        },
        {
          "id": 8,
          "title": "The Lord of the Rings: The Fellowship of the Ring",
          "image": "(link unavailable)",
          "year": 2001,
          "genres": ["Adventure", "Fantasy"],
          "likes": 200,
          "ratings": "8.80",
          "director": "Peter Jackson",
          "top_cast": "Elijah Wood, Viggo Mortensen",
          "overview": "A hobbit, a wizard, a dwarf, and a human embark on a quest...",
          "trailer": "(trailer link)"
        }
      ]
    };
    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(pagedResponse.response);
  });

  it('Should return empty list when there are no movies', async () => {
    await movieService.clearResponseArray();
    const response = await request(app).get('/v1/movies?page=1&limit=6');
    const pagedResponse = { response: [] }
    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(pagedResponse.response);
  })

  it('Should return invalid input when page number is invalid', async () => {
    const response = await request(app).get('/v1/movies?page=sa89&limit=6');
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid page number' });
  })

  it('Should return invalid input when limit number is invalid', async () => {
    const response = await request(app).get('/v1/movies?page=1&limit=-23jdj');
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
  })

  it('Should return invalid input when page number is negative', async () => {
    const response = await request(app).get('/v1/movies?page=-1&limit=8');
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid page number' });
  })

  it('Should return invalid input when limit number is negative', async () => {
    const response = await request(app).get('/v1/movies?page=1&limit=-8');
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
  })

  it('Should return invalid input when page number is 0', async () => {
    const response = await request(app).get('/v1/movies?page=0&limit=6');
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid page number' });
  })

  it('Should return invalid input when limit number is 0', async () => {
    const response = await request(app).get('/v1/movies?page=1&limit=0');
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
  })
});


// Search movie API Test
describe('Search API', () => {
  it('Retrieves a list of movies based on users search', async () => {
    const query = 'duplicate1'
    const response = await request(app).get(`/v1/movies/search?q=${query}&page=${1}&limit=${4}`);
    const searchData = {
      response: [
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
        }
      ]
    }
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(searchData);
  })

  it('Retrieves not found when search input doesnt match any data', async () => {
    const query = 'abcde'
    const response = await request(app).get(`/v1/movies/search?q=${query}&page=${2}&limit=${4}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'movie not found' });
  })

  it('Retrieves not found when no character is entered', async () => {
    let query;
    const response = await request(app).get(`/v1/movies/search?q=${query}&page=${1}&limit=${4}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'movie not found' });

  })
})


// Show movie details API Test
describe('Movie Details API', () => {
  it('Retrieve a single movie by its ID', async () => {
    const response = await request(app).get(`/v1/movies/${9}`);
    const expectedMovieData = {
      response: [
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
        }
      ]
    }
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expectedMovieData);
  })

  it('Retrieve not found when movie id doesnt exist', async () => {
    const response = await request(app).get(`/v1/movies/${29}`);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'movie not found' });
  })
})



// Get comments API Test
describe('Movie comments API', () => {
  it('Retrieve a paginated list of comments', async () => {
    const response = await request(app).get(`/v1/movies/${1}/comments?page=1&limit=4`);
    const expectedComment = {
      response: [
        {
          "id": 2,
          "movie_id": 1,
          "author": "Fantastic man",
          "content": "A thought-provoking sci-fi movie.",
          "created_at": "2024-08-12T15:11:27.765Z"
          // "created_at": "Sun Sep 01 2024 16:03:49 GMT+0100 (West Africa Standard Time)"
        },
        {
          "id": 8,
          "movie_id": 1,
          "author": "Fan boy",
          "content": "This makes it my 100th watch today.",
          "created_at": "2024-01-12T15:11:27.765Z"
        }
      ]
    }
    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(expectedComment.response);
  })

  it('Retrieve a paginated list of comments', async () => {
    const response = await request(app).get(`/v1/movies/${10}/comments?page=2&limit=3`);
    const expectedComment = {
      response: [
        {
          "id": 10,
          "movie_id": 10,
          "author": "Loona",
          "content": "The best this month so far.",
          "created_at": "2024-15-12T15:19:00.765Z"
        }
      ]
    }
    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(expectedComment.response);
  })

  it('Retrieve an empty list when there are no comments', async () => {
    const response = await request(app).get(`/v1/movies/${7}/comments?page=1&limit=4`);
    const expectedComment = {
      response: []
    }
    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(expectedComment.response);
  })
})

// Post a comment API Test
describe('Post Comment API', () => {
  it('Should create a new comment for a movie using the movie ID', async () => {
    const movieId = 3;
    const commentData = {
      content: 'I love comments',
      author: 'Boss',
    };
    const response = await request(app)
      .post(`/v1/movies/${movieId}/comments`)
      .set("Content-Type", "application/json")
      .send(commentData);

    const expectedResponse = { message: 'comment created successfully' }
    expect(response.status).toBe(201);
    expect(response.body).toEqual(expectedResponse);
    // expect(response.body).toHaveProperty('id');
    // expect(response.body.movieId).toBe(movieId);
    // expect(response.body.content).toBe(commentData.content);
    // expect(response.body.author).toBe(commentData.author);
  })
})



// Get similar movies API Test
describe('Similar Movies API', () => {
  it('Retrieve a paginated list of comments', async () => {
    const response = await request(app).get(`/v1/movies/${2}/similar-movies?page=1&limit=4`);
    const similarMovies = {
      response: [
        {
          "id": 1,
          "title": "The Shawshank Redemption",
          "image": "(link unavailable)",
          "year": 1994,
          "genres": ["Drama"],
          "likes": 100,
          "ratings": "9.20",
          "director": "Frank Darabont",
          "top_cast": "Tim Robbins, Morgan Freeman",
          "overview": "Two imprisoned men bond over a number of years...",
          "trailer": "(trailer link)"
        },
        {
          "id": 4,
          "title": "12 Angry Men",
          "image": "(link unavailable)",
          "year": 1957,
          "genres": ["Drama"],
          "likes": 50,
          "ratings": "9.00",
          "director": "Sidney Lumet",
          "top_cast": "Henry Fonda, Martin Balsam",
          "overview": "A jury holdout attempts to prevent a miscarriage of justice...",
          "trailer": "(trailer link)"
        },
        {
          "id": 5,
          "title": "Schindlers List",
          "image": "(link unavailable)",
          "year": 1993,
          "genres": ["Biography", "Drama", "History"],
          "likes": 100,
          "ratings": "8.90",
          "director": "Steven Spielberg",
          "top_cast": "Liam Neeson, Ben Kingsley",
          "overview": "In German-occupied Poland during World War II...",
          "trailer": "(trailer link)"
        },
        {
          "id": 7,
          "title": "Pulp Fiction",
          "image": "(link unavailable)",
          "year": 1994,
          "genres": ["Crime", "Drama"],
          "likes": 150,
          "ratings": "8.80",
          "director": "Quentin Tarantino",
          "top_cast": "John Travolta, Samuel L. Jackson",
          "overview": "The lives of two mob hitmen, a boxer, a pair of diner bandits...",
          "trailer": "(trailer link)"
        }
      ]
    }
    expect(response.status).toBe(200);
    expect(response.body.response).toEqual(similarMovies.response);
  })
})