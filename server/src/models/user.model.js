const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, `L'email est obligatoire`],
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, `Le format de l'email est invalide`]
    },
    password: {
      type: String,
      required: [true, `Le mot de passe est obligatoire`]
      //TODO: handle password strength in frontend
    },
    name: {
      type: String,
      required: [true, `Le nom est obligatoire`],
      trim: true
    },
    role: {
      type: String,
      required: [true, `Le rôle est obligatoire`],
      enum: ['ROLE_ADMIN', 'ROLE_OWNER', 'ROLE_CUSTOMER', 'ROLE_REGISTERED']
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('User', userSchema);