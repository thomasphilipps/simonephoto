const mongoose = require('mongoose');

const pictureSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de l’image est requis'],
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    uri: {
      type: String,
      required: [true, 'L’URL de l’image est requise'],
      trim: true,
      match: [
        /^https:\/\/.*\.(?:png|jpg)$/i,
        'L’URL doit être en HTTPS et pointer vers une image .png ou .jpg'
      ]
    },
    thumb_uri: {
      type: String,
      required: [true, 'L’URL de la miniature est requise'],
      trim: true,
      match: [
        /^https:\/\/.*\.(?:png|jpg)$/i,
        'L’URL doit être en HTTPS et pointer vers une image .png ou .jpg'
      ]
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('Picture', pictureSchema);
