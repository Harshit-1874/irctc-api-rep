const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const authMiddleware = {
  verifyToken: async (req, res, next) => {
    try {
      const token = req.headers['authorization'];
      console.log(token);
      if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      req.user = decoded; // Attach the decoded token to the request
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token.', error });
    }
  },

  isAdmin: async (req, res, next) => {
    try {
      const user = await User.findByPk(req.user.id);
      if (user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admins only.' });
      }
      next();
    } catch (error) {
      res.status(500).json({ message: 'Server error.' });
    }
  },
};

module.exports = authMiddleware;
