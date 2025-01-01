const request = require('supertest');
const { app, server } = require('../index');
const movieService = require('../services/movieServices');
const commentService = require('../services/commentServices');
const { seed, destroy } = require('./seeds/seedGenerator');
const assert = require('assert');
const { log } = require('console');

beforeEach(async () => {
  await seed();
});

afterEach(async () => {
  await destroy();
});

afterAll((done) => {
  server.close(done);
});


const runPaginationValidationTests = (endpoint) => {
  describe(`${endpoint} Pagination Validation`, () => {
    const query = 'Dark';
    const query = 'Dark';
    const newEndpoint = (endpoint === '/v1/movies/search' ? `/v1/movies/search?q=${query}&` : '/v1/movies?')

    const checkIfEmpty = (
      endpoint === `/v1/movies/${1}/comments` ?
        commentService.checkIfAnyCommentsExist() :
        movieService.checkIfAnyMoviesExist()
    )

    it('Should return invalid input when page number is invalid', async () => {
      assert(checkIfEmpty, 'Database is empty');

      const page = 'abc', limit = 6;
      const response = await request(app).get(`${newEndpoint}page=${page}&limit=${limit}`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page number' });
    });

    it('Should return invalid input when limit number is invalid', async () => {
      assert(checkIfEmpty, 'Database is empty');

      const page = 1, limit = 'xyz';
      const response = await request(app).get(`${newEndpoint}page=${page}&limit=${limit}`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
    });

    it('Should return invalid input when page number is negative', async () => {
      assert(checkIfEmpty, 'Database is empty');

      const page = -1, limit = 4;
      const response = await request(app).get(`${newEndpoint}page=${page}&limit=${limit}`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page number' });
    });

    it('Should return invalid input when limit number is negative', async () => {
      assert(checkIfEmpty, 'Database is empty');

      const page = 1, limit = -2;
      const response = await request(app).get(`${newEndpoint}page=${page}&limit=${limit}`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
    });

    it('Should return invalid input when page number is 0', async () => {
      assert(checkIfEmpty, 'Database is empty');

      const page = 0, limit = 6;
      const response = await request(app).get(`${newEndpoint}page=${page}&limit=${limit}`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page number' });
    });

    it('Should return invalid input when limit number is 0', async () => {
      assert(checkIfEmpty, 'Database is empty');

      const page = 1, limit = 0;
      const response = await request(app).get(`${newEndpoint}page=${page}&limit=${limit}`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
    });

    it('Should return an empty array if the page number exceeds total pages', async () => {
      assert(checkIfEmpty, 'Database is empty');

      const page = 1, limit = 2;
      const initialResponse = await request(app).get(`${newEndpoint}page=${page}&limit=${limit}`);

      const outOfBoundsPage = initialResponse.body.pagination.totalPages + 1;
      const response = await request(app).get(`${newEndpoint}page=${outOfBoundsPage}&limit=4`);

      expect(response.status).toBe(200);
      expect(response.body.response).toStrictEqual([]);
    });
  });
};

// Movie list API Test
describe('Get Movies API', () => {
  runPaginationValidationTests('/v1/movies');

  it('Should return a paginated list of movies for page 1 with limit 6', async () => {
    const page = 1, limit = 6;
    const response = await request(app).get(`/v1/movies?page=${page}&limit=${limit}`);

    // Validate status
    expect(response.status).toBe(200);

    // Validate response structure
    const movies = response.body.response;
    expect(Array.isArray(movies)).toBe(true);
    expect(movies.length).toBeLessThanOrEqual(limit);

    // Validate individual movie structure
    movies.forEach(movie => {
      expect(movie).toHaveProperty('id');
      expect(movie).toHaveProperty('title');
      expect(movie).toHaveProperty('release_date');
      expect(movie).toHaveProperty('genres');
      expect(movie).toHaveProperty('ratings');
    });

    // Optional: Check specific data points (example)
    expect(movies[0].title).toBe('The Shawshank Redemption');
  });

  it('Should return a paginated list of movies for page 2 limit 4', async () => {
    const page = 2, limit = 4;
    const response = await request(app).get(`/v1/movies?page=${page}&limit=${limit}`);

    expect(response.status).toBe(200);
    response.body.response.forEach(movie => {
      expect(movie).toEqual(expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        release_date: expect.any(String),
        genres: expect.any(Array),
      }));
    });
  });

  it('Should return an empty list when there are no movies', async () => {
    await movieService.deleteAllMovies();
    const page = 1, limit = 6;
    const response = await request(app).get(`/v1/movies?page=${page}&limit=${limit}`);

    expect(response.status).toBe(200);
    expect(response.body.response).toEqual([]);
  })
});

// Search movie API Test
describe('Search API', () => {
  runPaginationValidationTests('/v1/movies/search');

  it('Should return movies list with similar title based on user search input', async () => {
    const q = 'The', page = 1, limit = 4;
    const q = 'The', page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/search?q=${q}&page=${page}&limit=${limit}`);

    // console.log(response.body.response);
    
    expect(response.status).toBe(200);
    response.body.response.forEach(movie => {
      expect(movie).toEqual(expect.objectContaining({
        id: expect.any(Number),
        title: expect.any(String),
        release_date: expect.any(String),
        genres: expect.any(Array),
      }));
    });

  })

  it('Should return an empty list when search doesnt match any data in the DB', async () => {
    assert(await movieService.checkIfAnyMoviesExist(), 'No movies in the DB');

    const q = 'abcde', page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/search?q=${q}&page=${page}&limit=${limit}`);

    expect(response.status).toBe(200);
    expect(response.body.response).toEqual([]);
  })

  it('Should return 400 when search query is empty', async () => {
    const q = '', page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/search?q=${q}&page=${page}&limit=${limit}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Search query cannot be empty or just spaces' });
  })

  it('Should return 400 when search query is just spaces', async () => {
    const q = '     ', page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/search?q=${q}&page=${page}&limit=${limit}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Search query cannot be empty or just spaces' });
  })

  it('Should return 400 if search query is not provided in the API', async () => {
    const page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/search?page=${page}&limit=${limit}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Search query cannot be empty or just spaces' });
  });
})

// Show movie details API Test
describe('Movie Details API', () => {
  it('Should return a single movie using movie id', async () => {
    const page = 2, limit = 4;
    const movie = await movieService.getMovies(page, limit);
    const movieId = movie.response[0].id;

    const response = await request(app).get(`/v1/movies/${movieId}`);

    expect(response.status).toBe(200);
    expect(response.body.response).toEqual(expect.objectContaining({
      id: 5,
      title: '12 Angry Men',
      release_date: '1957-04-10',
      genres: expect.arrayContaining([18]),
    }));
  })

  it('Shoud retrun 404 when movie id doesnt exist', async () => {
    const movieId = 29;
    const response = await request(app).get(`/v1/movies/${movieId}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Movie ID not found' });
  })

  it('Should return 400 if the movie ID is invalid (non-numeric)', async () => {
    const invalidId = 'abc';
    const response = await request(app).get(`/v1/movies/${invalidId}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });

  it('Should return 400 if the movie ID is invalid (negative number)', async () => {
    const invalidId = -5;
    const response = await request(app).get(`/v1/movies/${invalidId}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });
})

// Get comments API Test
describe('Get Movie comments API', () => {
  runPaginationValidationTests(`/v1/movies/${1}/comments`);

  it('Should return a paginated list of comments for a movie', async () => {
    const page = 1, limit = 2;
    const movie = await movieService.getMovies(page, limit);
    const movieId = movie.response[0].id;
    const response = await request(app).get(`/v1/movies/${movieId}/comments?page=${page}&limit=${limit}`);

    const expectedResponse = [
      {
        movie_id: movieId,
        author: 'movie critic',
        content: 'Mind-bending action movie.',
      }
    ]

    expect(response.status).toBe(200);
    const actualResponse = response.body.response.map(({ id, created_at, ...rest }) => rest);
    expect(actualResponse).toEqual(expectedResponse);
  })

  it('Should return a paginated list of comments for a movie', async () => {
    const page = 1, limit = 2;
    const movie = await movieService.getMovies(page, limit);
    const movieId = movie.response[0].id;
    const response = await request(app).get(`/v1/movies/${movieId}/comments?page=${page}&limit=${limit}`);

    const expectedResponse = [
      {
        movie_id: movieId,
        author: 'movie critic',
        content: 'Mind-bending action movie.',
      }
    ]
    expect(response.status).toBe(200);
    expect(response.status).toBe(200);
    const actualResponse = response.body.response.map(({ id, created_at, ...rest }) => rest);
    expect(actualResponse).toEqual(expectedResponse);
  })

  it('Should return an empty list when there are no comments', async () => {
    await commentService.deleteAllComments();

    const page = 1, limit = 2;
    const movie = await movieService.getMovies(page, limit);
    const movieId = movie.response[0].id;
    const response = await request(app).get(`/v1/movies/${movieId}/comments?page=${page}&limit=${limit}`);

    expect(response.status).toBe(200);
    expect(response.body.response).toEqual([]);
  })

  it('Should return 404 if movie with given ID does not exist', async () => {
    const movieId = 20, page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/${movieId}/comments?page=${page}&limit=${limit}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Movie ID not found' });
  })

  it('Should return 400 if the movie ID is invalid (non-numeric)', async () => {
    const invalidId = 'abc', page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/${invalidId}/comments?page=${page}&limit=${limit}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });

  it('Should return 400 if the movie ID is invalid (negative number)', async () => {
    const invalidId = -5, page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/${invalidId}/comments?page=${page}&limit=${limit}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });
})

// Post a comment API Test
describe('Post Comment API', () => {
  it('Should create a new comment for a movie using the movie ID', async () => {
    const page = 3, limit = 4;
    const movie = await movieService.getMovies(page, limit);
    const movieId = movie.response[0].id;
    const commentData = {
      content: 'I love comments',
      author: 'Boss',
    };

    const response = await request(app)
      .post(`/v1/movies/${movieId}/comments`)
      .set("Content-Type", "application/json")
      .send(commentData);

    const expectedResponse = {
      response: {
        movie_id: movieId,
        author: 'Boss',
        content: 'I love comments'
      }
    }

    expect(response.status).toBe(201);
    expect(response.body.response).toEqual(
      expect.objectContaining(expectedResponse.response)
    );
  })

  it('Should return 400 when movie ID is invalid', async () => {
    const movieId = 'asaxsa';
    const commentData = {
      content: 'I love comments',
      author: 'empty ID',
    };

    const response = await request(app)
      .post(`/v1/movies/${movieId}/comments`)
      .set("Content-Type", "application/json")
      .send(commentData);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  })

  it('Should return 400 when content is empty', async () => {
    const movieId = 1;
    const commentData = {
      content: '',
      author: 'empty content',
    };

    const response = await request(app)
      .post(`/v1/movies/${movieId}/comments`)
      .set("Content-Type", "application/json")
      .send(commentData);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Content cannot be empty' });
  })

  it('Should return 400 when author name is not entered', async () => {
    const movieId = 5;
    const commentData = {
      content: 'no author',
      author: '',
    };

    const response = await request(app)
      .post(`/v1/movies/${movieId}/comments`)
      .set("Content-Type", "application/json")
      .send(commentData);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Author name is required' });
  })
})

// Get similar movies API Test
describe('Similar Movies API', () => {
  runPaginationValidationTests(`/v1/movies/${2}/similar-movies`);

  it('Should return a paginated list of similar movies with matching genres', async () => {
    const page = 1, limit = 10;
    const movie = await movieService.getMovies(page, limit);
    const movieId = movie.response[1].id;
    const response = await request(app).get(`/v1/movies/${movieId}/similar-movies?page=${page}&limit=${limit}`);

    const expectedGenres = [18, 80];
    const movieGenres = response.body.response.map(movie => movie.genres);

    expect(response.status).toBe(200);
    movieGenres.forEach(genres => {
      const hasMatchingGenre = expectedGenres.some(expectedGenre => genres.includes(expectedGenre));
      expect(hasMatchingGenre).toBe(true);
    });
  })

  // it('Should return empty list when there are no movies with similar genre', async () => {
  //   assert(await movieService.checkIfAnyMoviesExist(), 'No movies in the DB');

  //   const page = 3, limit = 4;
  //   const movie = await movieService.getMovies(page, limit);

  //   const movieId = movie.response[movie.response.length - 1].id;
  //   const response = await request(app).get(`/v1/movies/${movieId}/similar-movies?page=${page}&limit=${limit}`);

  //   expect(response.status).toBe(200);
  //   expect(response.body.response).toStrictEqual([]);
  // })

  it('Should return 404 if movie with given iD does not exist', async () => {
    const movieId = 30, page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/${movieId}/similar-movies?page=${page}&limit=${limit}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Movie ID not found' });
  })

  it('Should return 400 if the movie ID is invalid (non-numeric)', async () => {
    const invalidId = 'abc', page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/${invalidId}/comments?page=${page}&limit=${limit}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });

  it('Should return 400 if the movie ID is invalid (negative number)', async () => {
    const invalidId = -5, page = 1, limit = 4;
    const response = await request(app).get(`/v1/movies/${invalidId}/comments?page=${page}&limit=${limit}`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });
})