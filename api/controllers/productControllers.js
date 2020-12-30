const { errorMonitor } = require('nodemailer/lib/mailer');
const Product = require('../models/productModel');
const ErrorResponse = require('../services/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');

// get all products with optional pagination
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const pageSize = 10;
  const page = Number(req.query.pageNumber);
  let keyword = {};

  if (req.query.keyword) {
    keyword = {
      name: {
        $regex: req.query.keyword,
        $options: 'i',
      },
    };
  }

  const count = await Product.countDocuments({
    ...keyword,
  });

  const products = await Product.find({
    ...keyword,
  })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  if (!products) {
    return next(new ErrorResponse('No hay productos en el sistema', 404));
  }

  res.status(200).json({
    success: true,
    products,
  });
});

// find a single product by mongo id
exports.getProductById = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse('No se ha encontrado el producto solicitado', 404)
    );
  }

  res.status(200).json({
    success: true,
    product,
  });
});

// delete a product
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    return next(
      new ErrorResponse(
        'El sistema no ha encontrado el producto que usted desea eliminar',
        404
      )
    );
  }

  await product.remove();

  res.status(200).json({
    success: true,
    message: 'Producto ha sido eliminado',
  });
});

// create a new product
exports.createProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.create({
    name: 'Sample name',
    price: 0,
    user: req.user._id,
    image: '/images/sample.jpg',
    brand: 'Sample brand',
    category: 'Sample category',
    countInStock: 0,
    numReviews: 0,
    description: 'Sample description',
  });

  res.status(201).json({
    success: true,
    product,
  });
});

// update a product
exports.updateProduct = asyncHandler(async (req, res, next) => {
  const updatedProduct = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
      context: 'query',
    }
  );

  res.status(200).json({
    success: true,
    product: updatedProduct,
  });
});

// create a new review for a product
exports.createReview = asyncHandler(async (req, res, next) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  // product was not found in db
  if (!product) {
    return next(
      new ErrorResponse('El producto no fue encontrado en el sistema', 404)
    );
  }

  const indexOfReview =
    product.reviews.length < 1
      ? -1
      : product.reviews
          .map(r => r.user.toString() === req.user._id.toString())
          .indexOf(true);

  const review = {
    name: req.user.name,
    rating: Number(rating),
    comment,
    user: req.user._id,
  };

  if (indexOfReview === -1) {
    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      success: true,
    });
  } else {
    product.reviews[indexOfReview] = review;

    await product.save();

    res.status(200).json({
      success: true,
    });
  }
});

// get top rated products
exports.topRatedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({}).sort({ rating: -1 }).limit(3);

  if (!products) {
    return next(new ErrorResponse('No hay productos con rating', 404));
  }

  res.status(200).json({
    success: true,
    products,
  });
});
