
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

const jwt = require('jsonwebtoken');
module.exports.protect = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'Not authorized' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

function checkRole(requiredRole) {
  return (req, res, next) => {
    if (req.user.role !== requiredRole) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    next();
  };
}

