const fs = require('fs');
const mongoose = require('mongoose');
const keys = require('../config/dev');

// Load models
const User = require('../models/UserModel');
const Product = require('../models/productModel');

const users = require('./users');
const products = require('./products');
const Order = require('../models/orderModel');

// Connect to DB
mongoose.connect(keys.mongoUri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

// Import into DB
const importData = async () => {
  try {
    await User.create(users);
    await Product.create(products);
    console.log('Data Imported...');
    process.exit();
  } catch (err) {
    console.error(err.message);

    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await User.deleteMany();
    await Product.deleteMany();
    await Order.deleteMany();

    console.log('data was destroyed successfully');

    process.exit();
  } catch (err) {
    console.error(error.message);

    process.exit(1);
  }
};

if (process.argv[2] === '-i') {
  importData();
} else if (process.argv[2] === '-d') {
  deleteData();
}
