const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la galerie est requis'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'La description de la galerie est requise'],
      trim: true
    },
    date: {
      type: Date
    },
    pictures: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Picture'
      }
    ],
    categories: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category'
      }
    ],
    isPrivate: {
      type: Boolean,
      default: false
    },
    allowedCustomers: [
      {
        type: mongoose.Schema.Types.ObjectId, ref: 'User'
      }
    ]
  },
  {timestamps: true}
);

module.exports = mongoose.model('Gallery', gallerySchema);
