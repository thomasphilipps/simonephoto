import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Le titre de la review est requis'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Le nom est requis'],
      trim: true
    },
    author_email: {
      type: String,
      required: [true, 'L’email est requis'],
      trim: true,
      validate: {
        validator: (v) => /\S+@\S+\.\S+/.test(v),
        message: (props) => `${props.value} n’est pas un email valide !`
      }
    },
    comment: {
      type: String,
      required: [true, 'Le commentaire est requis'],
      trim: true
    },
    rating: {
      type: Number,
      required: [true, 'La note est requise'],
      min: [1, 'La note doit être comprise entre 1 et 5'],
      max: [5, 'La note doit être comprise entre 1 et 5']
    },
    is_public: {
      type: Boolean,
      default: false
    }
  },
  {timestamps: true}
);

export default mongoose.model('Review', reviewSchema);