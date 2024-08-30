const request = require('supertest');
const app = require('../index');


// Movie list API Test
describe('Movies API', () => {
  it('Should return a paginated list of movies', async () => {
    const response = await request(app).get('/v1/movies?page=1&limit=6');
    const pagedResponse = [
      {
        "id": 1,
        "title": "The Shawshank Redemption",
        "image": "(link unavailable)",
        "year": 1994,
        "genres": "Drama",
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
        "genres": "Crime, Drama",
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
        "genres": "Action, Thriller",
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
        "genres": "Drama",
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
        "genres": "Biography, Drama, History",
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
        "genres": "Adventure, Fantasy",
        "likes": 200,
        "ratings": "8.90",
        "director": "Peter Jackson",
        "top_cast": "Elijah Wood, Viggo Mortensen",
        "overview": "Gandalf and Aragorn lead the World of Men against Saurons army...",
        "trailer": "(trailer link)"
      }
    ]
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(pagedResponse);
  });
});



// Search movie API Test
describe('Search API', () => {
  it('Retrieves a list of movies based on users search', async () => {
    const searchValue = 'duplicate2'
    const response = await request(app).get(`/v1/movies/search?q=${searchValue}`);
    expect(response.status).toBe(200);
    expect(response.body).toBe(duplicate);
  })
})


// Show movie details API Test
describe('Movie API', () => {
  it('Retrieve a single movie by its ID', async () => {
    const response = await request(app).get(`/v1/movies/${9}`);
    const expectedData = {
      "id": 9,
      "title": "duplicate1",
      "image": "(link unavailable)",
      "year": 1000,
      "genres": "duplicate",
      "likes": 100,
      "ratings": "1",
      "director": "duplicate",
      "top_cast": "duplicate",
      "overview": "duplicate...",
      "trailer": "(trailer link)"
    }
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual(expectedData);
  })
})



