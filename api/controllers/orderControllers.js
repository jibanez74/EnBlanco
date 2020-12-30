const Order = require('../models/orderModel');
const uuid = require('uuid');
const asyncHandler = require('../middleware/asyncHandler');
const ErrorResponse = require('../services/ErrorResponse');
const { stripePrivate } = require('../config/keys');
const stripe = require('stripe')(stripePrivate);

// create a new order
exports.createOrder = asyncHandler(async (req, res, next) => {
  if (req.body.orderItems && req.body.orderItems.length === 0) {
    return next(new ErrorResponse('Orden no es válida', 400));
  } else {
    req.body.user = req.user._id;

    const order = await Order.create(req.body);

    res.status(201).json({
      success: true,
      order,
    });
  }
});

// get an order by there mongo id
exports.getOrderById = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'name email'
  );

  if (!order) {
    return next(
      new ErrorResponse(`La orden ${req.params.id} no fue encontrada`, 404)
    );
  }

  res.status(200).json({
    success: true,
    order,
  });
});

// update order to paid
exports.updateOrderToPaid = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`La orden ${req.params.id} no fue encontrada`, 404)
    );
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: uuid.v4(),
    status: 'Admin marked it as paid',
    update_time: Date.now(),
    email_address: req.user.email,
  };

  await order.save();

  res.status(200).json({
    success: true,
  });
});

// update order to delivered
exports.updateOrderToDelivered = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(
      new ErrorResponse(`La orden ${req.params.id} no fue encontrada`, 404)
    );
  }

  order.isDelivered = true;
  order.deliveredAt = Date.now();

  await order.save();

  res.status(200).json({
    success: true,
  });
});

// allows a user to get there own orders
exports.getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });

  if (!orders) {
    return next(
      new ErrorResponse('Actualmente no hay ordenes en el sistema', 404)
    );
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

// get all orders
exports.getAllOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate('user', 'id name');

  if (!orders) {
    return next(
      new ErrorResponse('Actualmente no hay ordenes en el sistema', 404)
    );
  }

  res.status(200).json({
    success: true,
    orders,
  });
});

// process stripe payment
exports.processPayment = asyncHandler(async (req, res, next) => {
  console.log('starting controller');

  const { token, order } = req.body;

  if (!token || !order) {
    return next(new ErrorResponse('Operación cancelada', 400));
  }

  const charge = await stripe.charges.create({
    amount: Math.round(100 * parseFloat(order.totalPrice)),
    currency: 'usd',
    description: JSON.stringify(order.items),
    source: token.id,
  });

  if (charge.failure_code) {
    return next(new ErrorResponse('Proceso cancelado', 422));
  }

  const updatedOrder = await Order.findById(order._id);

  updatedOrder.isPaid = true;
  updatedOrder.paidAt = Date.now();
  order.paymentResult = {
    id: charge.id,
    status: 'has been paid',
    update_time: charge.created,
    email_address: req.user.email_address,
  };

  await updatedOrder.save();

  res.status(200).json({
    success: true,
  });
});
