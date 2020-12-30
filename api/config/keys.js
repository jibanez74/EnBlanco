if (
  process.env.NODE_ENV === 'development' ||
  process.env.NODE_ENV === 'staging'
) {
  module.exports = require('./dev');
} else if (process.env.NODE_ENV === 'production') {
  module.exports = require('./prod');
} else {
  process.env.NODE_ENV = 'development';
  module.exports = require('./dev');
}
