const mongoose = require('mongoose');
const reviewSchema = require('./ReviewModel');

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    reviews: [reviewSchema],

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    price: {
      type: Number,
      required: true,
    },

    countInStock: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Products', productSchema);

module.exports = Product;
