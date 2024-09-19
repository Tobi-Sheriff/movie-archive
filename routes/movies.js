const express = require('express');
const router = express.Router();
const movies = require('../controllers/movies');
const { validatePagination } = require('../middleware');


router.get('/', validatePagination, movies.index);

router.get('/search', movies.searchMovies);

router.route('/:id')
    .get(movies.movieDetails)

router.route('/:id/comments')
    .get(validatePagination, movies.getComments)
    .post(movies.postComment)

router.route('/:id/similar-movies')
    .get(validatePagination, movies.fetchSimilarMovies)

module.exports = router;
