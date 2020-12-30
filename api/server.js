const path = require('path');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const errorHandler = require('./middleware/error');
const hpp = require('hpp');
const { port, corsOptions, paypal } = require('./config/keys');

// load routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// init instance of express
const app = express();

// connect to db
require('./config/mongoConfig')();

/* middleware section */
// middleware for parsing body included in express
app.use(express.json());

// middleware to sanitize data going into mongo
app.use(mongoSanitize());

// Set security headers
app.use(helmet());

// Prevent XSS attacks
app.use(xss());

// Prevent http param pollution
app.use(hpp());

// Enable CORS
app.use(cors());

// set static folder for uploaded files
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

// mount routes
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/orders', orderRoutes);
app.use('/api/v1/upload', uploadRoutes);

// global middleware for managing errors
app.use(errorHandler);

// port for server to listen for connections
const openPort = process.env.PORT || 5000;

// setup server to listen for connections
const server = app.listen(
  openPort,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${port}`)
);

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
  console.log(`Error: ${err.message}`);
  // Close server & exit process
  // server.close(() => process.exit(1));
});
