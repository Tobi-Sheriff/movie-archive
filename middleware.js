// const MovieService = require('../movieServices');
// const movieService = new MovieService();


module.exports.validatePagination = async (req, res, next) => {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    // Check page number
    if (!Number.isInteger(page) || page <= 0 || page > 100) {
        return res.status(400).json({ error: 'Invalid page number' });
    }

    // Check limit number
    if (!Number.isInteger(limit) || limit <= 0 || limit > 50) {
        return res.status(400).json({ error: 'Invalid limit number' });
    }

    // return { valid: true };
    next();
}