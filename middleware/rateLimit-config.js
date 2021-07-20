const rateLimit = require('express-rate-limit');

// Rate limiting middleware for express
const limiter = rateLimit({
    windowMs: 15* 60* 1000,
    max: 500
});

module.exports = limiter;