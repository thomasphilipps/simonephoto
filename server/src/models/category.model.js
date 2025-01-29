const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la catégorie est requis'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'La description de la catégorie est requise'],
      trim: true
    },
    parent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      default: null
    }
  },
  {timestamps: true}
);

module.exports = mongoose.model('Category', categorySchema);
