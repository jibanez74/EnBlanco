const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const { jwtSecret, jwtExpiresIn } = require('../config/keys');

// define user schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 60,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
    },

    password: {
      type: String,
      minlength: 8,
      maxlength: 128,
      required: true,
      select: false,
    },

    isAdmin: {
      type: Boolean,
      default: false,
    },

    resetPasswordToken: String,

    resetPasswordExpire: Date,

    confirmEmailToken: String,

    isEmailConfirmed: {
      type: Boolean,
      default: false,
    },

    twoFactorCode: String,

    twoFactorCodeExpire: Date,

    twoFactorEnable: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// sign a token and return it
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    {
      id: this._id,
    },
    jwtSecret,
    {
      expiresIn: jwtExpiresIn,
    }
  );
};

// function to compare passwords on login
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// if the user has provided a new password, encrypt it
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

// generates a token for forgot password work flow
UserSchema.methods.getResetPasswordToken = function () {
  // Generate token
  const resetToken = crypto.randomBytes(20).toString('hex');

  // Hash token and set to resetPasswordToken field
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  // Set expire
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

// Generate email confirm token
UserSchema.methods.generateEmailConfirmToken = function (next) {
  // email confirmation token
  const confirmationToken = crypto.randomBytes(20).toString('hex');

  this.confirmEmailToken = crypto
    .createHash('sha256')
    .update(confirmationToken)
    .digest('hex');

  const confirmTokenExtend = crypto.randomBytes(100).toString('hex');
  const confirmTokenCombined = `${confirmationToken}.${confirmTokenExtend}`;

  return confirmTokenCombined;
};

const User = mongoose.model('Users', UserSchema);

module.exports = User;
