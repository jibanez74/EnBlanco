const path = require('path');
const router = require('express').Router();
const multer = require('multer');
const auth = require('../middleware/authorizer');
const isAdmin = require('../middleware/isAdmin');
const { apiUrl } = require('../config/keys');

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = filetypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb('Images only!');
  }
}

const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    checkFileType(file, cb);
  },
});

/*
  endpoint: /api/v1/upload/image
  description: uploads an image to the server
  method: post
  access: private
*/
router.post('/image', auth, isAdmin, upload.single('image'), (req, res) => {
  const filePath = `${apiUrl}/uploads/${req.file.filename}`;

  res.status(201).json({
    success: true,
    filePath: `${apiUrl}/uploads/${req.file.filename}`,
  });
});

module.exports = router;
