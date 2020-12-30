const mongoose = require('mongoose');
const { mongoUri } = require('./keys');

module.exports = async () => {
  const conn = await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  });

  console.log(`MongoDB Connected: ${conn.connection.host}`);
};
