
// middleware/paginationValidator.js
module.exports.validatePagination = async (req, res, next) => {
    const page = parseInt(req.query.page, 10);
    const limit = parseInt(req.query.limit, 10);

    // Check if page is a valid integer and within a reasonable range
    if (!Number.isInteger(page) || page <= 0) {
        return res.status(400).json({ error: 'Invalid page number' });
    }

    // Check if limit is a valid integer and within a reasonable range
    if (!Number.isInteger(limit) || limit <= 0) {
        return res.status(400).json({ error: 'Invalid limit number' });
    }

    next();
}