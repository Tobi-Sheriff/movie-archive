const express = require('express');
const router = express.Router();
const moviesController = require('../controllers/movies');
const { validatePagination } = require('../middleware');


router.get('/', validatePagination, moviesController.index);

router.get('/search', validatePagination, moviesController.searchMovies);

router.route('/:id')
    .get(moviesController.movieDetails)

router.route('/:id/comments')
    .get(validatePagination, moviesController.getComments)
    .post(moviesController.postComment)

router.route('/:id/similar-movies')
    .get(validatePagination, moviesController.fetchSimilarMovies)

module.exports = router;
