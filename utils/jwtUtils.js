const jwt = require('jsonwebtoken');
require('dotenv').config();

const jwtUtils = {
  verifyToken: (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
  },
};

module.exports = jwtUtils;
