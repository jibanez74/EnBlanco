const router = require('express').Router();
const {
  createOrder,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getAllOrders,
  processPayment,
} = require('../controllers/orderControllers');
const auth = require('../middleware/authorizer');
const isAdmin = require('../middleware/isAdmin');

/*
  endpoint: /api/v1/orders/my_orders
  description: will get all orders for a user
  method: get
  access: private
*/
router.get('/my_orders', auth, getMyOrders);

/*
  endpoint: /api/v1/orders/all
  description: will fetch all orders in db
  method: get
  access: private
*/
router.get('/all', auth, isAdmin, getAllOrders);

/*
  endpoint: /api/v1/orders/:id
  description: fetch an order by there mongo id
  method: get
  access: private
*/
router.get('/:id', getOrderById);

/*
  endpoint: /api/v1/orders/create  
  description: creates a new order in db
  method: post
  access: private
*/
router.post('/create', auth, createOrder);

/*
  endpoint: /api/v1/orders/paid/:id
  description: will update an order to paid
  method: put
  access: private
*/
router.put('/paid/:id', auth, isAdmin, updateOrderToPaid);

/*
  endpoint: /api/v1/orders/stripe
  description: finalize a stripe charge operation
  method: post
  access: private
*/
router.put('/stripe', auth, processPayment);

/*
  endpoint: /api/v1/orders/delivered/:id
  description: change the delivered status of an order
  method: put
  access: private
*/
router.put('/delivered/:id', auth, isAdmin, updateOrderToDelivered);

module.exports = router;
