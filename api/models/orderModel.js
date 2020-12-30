const mongoose = require('mongoose');

// define model for orders
const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Users',
    },

    orderItems: [
      {
        name: {
          type: String,
          required: true,
          minLength: 2,
          maxLength: 60,
          trim: true,
        },

        qty: {
          type: Number,
          required: true,
          min: 0,
          max: 999999,
        },

        image: {
          type: String,
          required: true,
          trim: true,
        },

        price: {
          type: Number,
          required: true,
          min: 0,
          max: 999,
        },

        product: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: 'Products',
        },
      },
    ],

    shippingAddress: {
      address: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 80,
      },

      city: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
      },

      postalCode: {
        type: String,
        required: true,
        validate: {
          validator: postalCode =>
            postalCode.length === 5 || postalCode.length === 9,
        },
      },

      country: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
        maxLength: 30,
      },
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    paymentResult: {
      id: {
        type: String,
      },

      status: {
        type: String,
      },

      update_time: {
        type: String,
      },

      email_address: {
        type: String,
      },
    },

    taxPrice: {
      type: Number,
      required: true,
    },

    shippingPrice: {
      type: Number,
      required: true,
    },

    totalPrice: {
      type: Number,
      required: true,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: {
      type: Date,
    },

    isDelivered: {
      type: Boolean,
      default: false,
    },

    deliveredAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Orders', orderSchema);

module.exports = Order;
