const router = require('express').Router();
const {
  classicRegister,
  confirm,
  resendConfirmation,
  forgotPasswordEmail,
  forgotPasswordReset,
  classicLogin,
  getUserById,
  updateMyProfile,
  deleteUser,
  getMyProfile,
  updateUser,
  getAllUsers,
} = require('../controllers/userControllers');
const auth = require('../middleware/authorizer');
const isAdmin = require('../middleware/isAdmin');

/*
  endpoint: /api/v1/users/me
  description: returns the user's info
  method: get
  access: private
*/
router.get('/me', auth, getMyProfile);

/*
  endpoint: /api/v1/users/all
  description: returns all users in db
  method: get
  access: private
*/
router.get('/all', auth, isAdmin, getAllUsers);

/*
  endpoint: /api/v1/users/:id
  description: get a user by there mongo id
  method: get
  access: private
*/
router.get('/:id', auth, isAdmin, getUserById);

/*
  endpoint: /api/v1/users/login
  description: will authenticate a user and return a jwt
  method: post
  access: public
*/
router.post('/login', classicLogin);

/*
  endpoint: /api/v1/users/register
  description: will register a new user using email and password
  method: post
  access: public
*/
router.post('/register', classicRegister);

/*
  endpoint: /api/v1/user/confirm  
description: will confirm the user's account with crypto token
  method: put
  access: public
*/
router.put('/confirm', confirm);

/*
  endpoint: /api/v1/user/resend_confirmation
    description: will resend the confirmation email
    method: put
    access: public
    */
router.put('/resend_confirmation', resendConfirmation);

/*
  endpoint: /api/v1/user/forgot_password
  description: will send email to start forgot password workflow
  method: put
  access: public
*/
router.put('/forgot_password', forgotPasswordEmail);

/*
  endpoint: /api/v1/user/reset_password
  description: will reset the password of a user using the reset token
  method: put
  access: private
*/
router.put('/reset_password', forgotPasswordReset);

/*
  endpoint: /api/v1/users/profile/update
  description: update a user's profile
  method: put
  access: private
*/
router.put('/update', auth, updateMyProfile);

/*
  endpoint: /api/v1/users/update/:id
  description: updates a user
  method: put
  access: private
*/
router.put('/:id', auth, isAdmin, updateUser);

/*
  endpoint: /api/v1/users/:id
  description: will delete a user from mongo
  method: delete
  access: private
*/
router.delete('/delete/:id', auth, isAdmin, deleteUser);

module.exports = router;
