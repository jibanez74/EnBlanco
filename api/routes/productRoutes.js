const router = require('express').Router();
const {
  getAllProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createReview,
  topRatedProducts,
} = require('../controllers/productControllers');
const auth = require('../middleware/authorizer');
const isAdmin = require('../middleware/isAdmin');

/*
  endpoint: /api/v1/products/
  description: will create a new product
  method: get
  access: private
*/
router.get('/create', auth, isAdmin, createProduct);

/*
  endpoint: /api/v1/products/top_rated
  description: returns an array with the top 3 rated products
  method: get
  access: public
*/
router.get('/top', topRatedProducts);

/*
  endpoint: /api/v1/products/all
  description: gets a list of all products with pagination
  method: get
  access: public
*/
router.get('/all', getAllProducts);

/*
  endpoint: /api/v1/products/:id
  description: get a product by its mongo id
  method: get
  access: public
*/
router.get('/:id', getProductById);

/*
  endpoint: /api/v1/products/:id
  description: deletes a product from db
  method: delete
  access: private
*/
router.delete('/:id', auth, isAdmin, deleteProduct);

/*
  endpoint: /api/v1/products/:id
  description: will update a product's information
  method: put
  access: private
*/
router.put('/:id', auth, isAdmin, updateProduct);

/*
  endpoint: /api/v1/products/review/:id
  description: will create or update a review
  method: post
  access: private
*/
router.post('/review/:id', auth, createReview);

module.exports = router;
