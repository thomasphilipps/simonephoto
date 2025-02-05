const User = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const saltRounds = 10; // Number of salt rounds for hashing

module.exports = {
  /**
   * Creates a new user with hashed password and ensures the email is unique.
   */
  createUser: async (req, res) => {
    try {
      const {email, password, name, role} = req.body;
      if (!email || !password || !name || !role) {
        return res.status(400).json({error: 'Tous les champs (email, password, nom, rôle) sont obligatoires.'});
      }

      // Check if the email is already in use
      const existingUser = await User.findOne({email});
      if (existingUser) {
        return res.status(400).json({error: 'Cet email est déjà utilisé.'});
      }

      // Hash the password before saving
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({
        email,
        password: hashedPassword,
        name,
        role
      });

      const userResponse = user.toObject();
      delete userResponse.password; // Do not expose password in response
      return res.status(201).json(userResponse);
    } catch (error) {
      return res.status(400).json({error: error.message});
    }
  },

  /**
   * Authenticates a user and returns a JWT token in a cookie with role-specific expiration.
   */
  loginUser: async (req, res) => {
    try {
      const {email, password} = req.body;
      if (!email || !password) {
        return res.status(400).json({error: 'Email et mot de passe sont requis.'});
      }

      // Find user by email
      const user = await User.findOne({email});
      if (!user) {
        return res.status(401).json({error: 'Identifiants invalides.'});
      }

      // Compare provided password with stored hash
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({error: 'Identifiants invalides.'});
      }

      // Set token expiration based on user role:
      // Admin and Owner have a token valid for 7 days, others for 1 hour.
      let expiresIn = '1h';
      if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_OWNER') {
        expiresIn = '7d';
      }

      // Generate JWT token
      const token = jwt.sign(
        {id: user._id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn}
      );

      // Set cookie options: HTTP-only, secure in production, and SameSite protection
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expiresIn === '7d' ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000 // convert to ms
      });

      return res.status(200).json({message: 'Authentification réussie.'});
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
};
