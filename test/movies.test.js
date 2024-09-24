const request = require('supertest');
const app = require('../index');
const MovieService = require('../movieServices');

const movieService = new MovieService();


beforeEach(async () => {
  await movieService.initializeMovies();
  await movieService.initializeComments();
});
afterEach(async () => {
  await movieService.destroyCommentsDB();
  await movieService.destroyMoviesDB();
});


const runPaginationValidationTests = (endpoint) => {
  describe(`${endpoint} Pagination Validation`, () => {

    it('Should return invalid input when page number is invalid', async () => {
      const response = await request(app).get(`${endpoint}?page=abc&limit=6`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page number' });
    });

    it('Should return invalid input when limit number is invalid', async () => {
      const response = await request(app).get(`${endpoint}?page=1&limit=xyz`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
    });

    it('Should return invalid input when page number is negative', async () => {
      const response = await request(app).get(`${endpoint}?page=-1&limit=4`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page number' });
    });

    it('Should return invalid input when limit number is negative', async () => {
      const response = await request(app).get(`${endpoint}?page=1&limit=-2`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
    });

    it('Should return invalid input when page number is 0', async () => {
      const response = await request(app).get(`${endpoint}?page=0&limit=6`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid page number' });
    });

    it('Should return invalid input when limit number is 0', async () => {
      const response = await request(app).get(`${endpoint}?page=1&limit=0`);

      expect(response.status).toBe(400);
      expect(response.body).toStrictEqual({ error: 'Invalid limit number' });
    });

    it('Should return an empty array if the page number exceeds total pages', async () => {
      const response = await request(app).get(`${endpoint}?page=100&limit=4`);

      expect(response.status).toBe(200);
      expect(response.body.response).toStrictEqual([]);
    });
  });
};




// Movie list API Test
describe('Get Movies API', () => {
  runPaginationValidationTests('/v1/movies');

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
});



// Search movie API Test
describe('Search API', () => {
  // const endpoint = '/v1/movies/search?q=duplicate1';  // Example endpoint with search query
  // runPaginationValidationTests(endpoint);

  it('Should return movies list with similar title based on user search input', async () => {
    const q = 'duplicate1'
    const response = await request(app).get(`/v1/movies/search?q=${q}&page=${1}&limit=${4}`);

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
        },
        {
          id: 10,
          title: 'duplicate2',
          image: '(link unavailable)',
          year: 1000,
          genres: ['diffDuplicate'],
          likes: 100,
          ratings: '1',
          director: 'duplicate',
          top_cast: 'duplicate',
          overview: 'duplicate...',
          trailer: '(trailer link)'
        }

      ]
    }

    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(searchData.response);
  })

  it('Should return not found when search input doesnt match any data', async () => {
    const q = 'abcde'
    const response = await request(app).get(`/v1/movies/search?q=${q}&page=${2}&limit=${4}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'No movie match the search' });
  })

  it('Should return an error when search query is invalid', async () => {
    let q = '';
    const response = await request(app).get(`/v1/movies/search?q=${q}&page=${1}&limit=${4}`);

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: 'Invalid search query' });
  })
})



// Show movie details API Test
describe('Movie Details API', () => {
  it('Should return a single movie using movie id', async () => {
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

  it('Shoud retrun 404 when movie id doesnt exist', async () => {
    const response = await request(app).get(`/v1/movies/${29}`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Movie ID not found' });
  })

  it('Should return 400 if the movie ID is invalid (non-numeric)', async () => {
    const invalidId = 'abc';  // This is not a valid integer
    const response = await request(app).get(`/v1/movies/${invalidId}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });

  it('Should return 400 if the movie ID is invalid (negative number)', async () => {
    const invalidId = -5;  // Negative numbers may be considered invalid in your case
    const response = await request(app).get(`/v1/movies/${invalidId}`);
    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });

})



// Get comments API Test
describe('Get Movie comments API', () => {
  runPaginationValidationTests(`/v1/movies/${1}/comments`);

  it('Should return a paginated list of comments for movie with id 1', async () => {
    const response = await request(app).get(`/v1/movies/${1}/comments?page=1&limit=1`);
    const expectedComment = {
      response: [
        {
          "id": 2,
          "movie_id": 1,
          "author": "Fantastic man",
          "content": "A thought-provoking sci-fi movie.",
          "created_at": "2024-08-12T15:11:27.765Z"
          // "created_at": "Sun Sep 01 2024 16:03:49 GMT+0100 (West Africa Standard Time)"
        }
      ]
    }

    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(expectedComment.response);
  })

  it('Should return a paginated list of comments for movie with id 10', async () => {
    const response = await request(app).get(`/v1/movies/${10}/comments?page=2&limit=2`);
    const expectedComment = {
      response: [
        {
          "id": 9,
          "movie_id": 10,
          "author": "Miami",
          "content": "Do a cartoon version please...",
          "created_at": "2024-25-12T15:15:27.765Z"
        },
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

  it('Should return an empty list when there are no comments', async () => {
    const response = await request(app).get(`/v1/movies/${7}/comments?page=1&limit=4`);
    const expectedComment = {
      response: []
    }

    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual(expectedComment.response);
  })

  it('Should return 404 if movie with given ID does not exist', async () => {
    const response = await request(app).get(`/v1/movies/${20}/comments?page=1&limit=4`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Movie ID not found' });
  })

  it('Should return 400 if the movie ID is invalid (non-numeric)', async () => {
    const invalidId = 'abc';  // This is not a valid integer
    const response = await request(app).get(`/v1/movies/${invalidId}/comments?page=1&limit=4`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });

  it('Should return 400 if the movie ID is invalid (negative number)', async () => {
    const invalidId = -5;  // Negative numbers may be considered invalid in your case
    const response = await request(app).get(`/v1/movies/${invalidId}/comments?page=1&limit=4`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });
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

    const expectedResponse = {
      response: [
        {
          id: 11,
          movieId: '3',
          content: 'I love comments',
          author: 'Boss'
        }
      ]
    }

    expect(response.status).toBe(201);
    expect(response.body).toStrictEqual(expectedResponse);
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

  it('Should return empty list when there are no movies with similar genre', async () => {
    const response = await request(app).get(`/v1/movies/${10}/similar-movies?page=1&limit=4`);

    expect(response.status).toBe(200);
    expect(response.body.response).toStrictEqual([]);
  })

  it('Should return 404 if movie with given iD does not exist', async () => {
    const response = await request(app).get(`/v1/movies/${30}/similar-movies?page=1&limit=4`);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'Movie ID not found' });
  })

  it('Should return 400 if the movie ID is invalid (non-numeric)', async () => {
    const invalidId = 'abc';  // This is not a valid integer
    const response = await request(app).get(`/v1/movies/${invalidId}/comments?page=1&limit=4`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });

  it('Should return 400 if the movie ID is invalid (negative number)', async () => {
    const invalidId = -5;  // Negative numbers may be considered invalid in your case
    const response = await request(app).get(`/v1/movies/${invalidId}/comments?page=1&limit=4`);

    expect(response.status).toBe(400);
    expect(response.body).toStrictEqual({ error: 'Invalid movie ID' });
  });
})