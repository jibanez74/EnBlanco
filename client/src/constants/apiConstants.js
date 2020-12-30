const baseUrl =
  process.env.NODE_ENV === 'development'
    ? 'http://localhost:3000/api/v1'
    : 'https://enblanco-api.herokuapp.com/api/v1';

export default baseUrl;
