const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const authController = {
  register: async (req, res) => {
    try {
      const { username, email, password, role, name, phone_no } = req.body;

      if (!username || !email || !password || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email is already registered.' });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        username,
        email,
        password: hashedPassword,
        role,
        name,
        phone_no,
      });

      return res.status(201).json({ message: 'User registered successfully.', user: newUser });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
      }

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid credentials.' });
      }

      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      return res.status(200).json({
        message: 'Login successful.',
        token,
        user: { id: user.id, email: user.email, role: user.role },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error.' });
    }
  },
};

module.exports = authController;
