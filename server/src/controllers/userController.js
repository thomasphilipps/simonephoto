import User from '../models/user.model.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const saltRounds = 10;

export default {
  createUser: async (req, res) => {
    try {
      const {email, password, name, role} = req.body;
      if (!email || !password || !name || !role) {
        return res.status(400).json({error: 'Tous les champs (email, password, nom, rôle) sont obligatoires.'});
      }

      const existingUser = await User.findOne({email});
      if (existingUser) {
        return res.status(400).json({error: 'Cet email est déjà utilisé.'});
      }

      const hashedPassword = await bcrypt.hash(password, saltRounds);
      const user = await User.create({email, password: hashedPassword, name, role});

      const userResponse = user.toObject();
      delete userResponse.password;
      return res.status(201).json(userResponse);
    } catch (error) {
      return res.status(400).json({error: error.message});
    }
  },

  loginUser: async (req, res) => {
    try {
      const {email, password} = req.body;
      if (!email || !password) {
        return res.status(400).json({error: 'Email et mot de passe sont requis.'});
      }

      const user = await User.findOne({email});
      if (!user) {
        return res.status(401).json({error: 'Identifiants invalides.'});
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({error: 'Identifiants invalides.'});
      }

      let expiresIn = '1h';
      if (user.role === 'ROLE_ADMIN' || user.role === 'ROLE_OWNER') {
        expiresIn = '7d';
      }

      const token = jwt.sign(
        {id: user._id, email: user.email, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn}
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: expiresIn === '7d' ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000
      });

      return res.status(200).json({message: 'Authentification réussie.'});
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
};