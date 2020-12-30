const crypto = require('crypto');
const ErrorResponse = require('../services/ErrorResponse');
const User = require('../models/UserModel');
const asyncHandler = require('../middleware/asyncHandler');
const mailer = require('../config/emails');
const { clientUrl, emailFrom } = require('../config/keys');
const confirmTemplate = require('../templates/confirmTemplate');
const forgotTemplate = require('../templates/forgotPasswordTemplate');

// login user with email and password
exports.classicLogin = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new ErrorResponse('Por favor escriba su email y contraseña', 400)
    );
  }

  const user = await User.findOne({
    email,
    isEmailConfirmed: true,
  }).select('+password');

  // make sure user exists and the provided password is the correct one
  if (user && (await user.matchPassword(password))) {
    const jwt = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      userInfo: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: jwt,
      },
    });
  } else {
    return next(
      new ErrorResponse('El email o la contraseña no son validos', 401)
    );
  }
});

// get my profile info
exports.getMyProfile = (req, res) =>
  res.status(200).json({
    success: true,
    userInfo: req.user,
  });

// find a user by their mongo id
exports.getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse('El usuario no ha sido encontrado en el sistema', 404)
    );
  }

  res.status(200).json({
    success: true,
    userInfo: user,
  });
});

// register a new user with email and password
exports.classicRegister = asyncHandler(async (req, res, next) => {
  // first make sure that email is not already in use
  const existingUser = await User.findOne({
    email: req.body.email,
  });

  // the email entered was already in use by another user
  if (existingUser) {
    return next(
      new ErrorResponse(
        'El email que ha entrado ya está en uso por otro usuario',
        400
      )
    );
  }

  // create the user in mongo
  const user = await User.create(req.body);

  // generate a confirmation token
  const confirmToken = await user.generateEmailConfirmToken();

  // generate a confirm url with the token and the email of the newly created user
  const confirmUrl = `${clientUrl}/confirm/${confirmToken}`;

  // generate the email template
  const message = confirmTemplate(confirmUrl);

  // save the user with the confirm data
  user.save({ validateBeforeSave: false });

  // send the email
  await mailer.sendMail({
    from: emailFrom,
    to: req.body.email,
    subject: 'Cofirmación de cuenta de En Blanco',
    html: message,
  });

  res.status(201).json({
    success: true,
    user,
  });
});

// resend confirmation email
exports.resendConfirmation = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    isEmailConfirmed: false,
  });

  if (user) {
    // generate a confirmation token
    const confirmToken = user.generateEmailConfirmToken();

    // generate a confirm url with the token and the email of the newly created user
    const confirmUrl = `${clientUrl}/confirm?token=${confirmToken}`;

    // generate the email template
    const message = confirmTemplate(confirmUrl);

    // send the confirmation email
    await mailer.sendMail({
      from: emailFrom,
      to: req.body.email,
      subject: 'Cofirmación de cuenta de En Blanco',
      html: message,
    });
  }

  res.status(200).json({
    success: true,
  });
});

// confirm email account
exports.confirm = asyncHandler(async (req, res, next) => {
  const { token } = req.body;

  const splitToken = token.split('.')[0];
  const confirmEmailToken = crypto
    .createHash('sha256')
    .update(splitToken)
    .digest('hex');

  // get user by token
  const user = await User.findOne({
    confirmEmailToken,
    isEmailConfirmed: false,
  });

  if (!user) {
    return next(
      new ErrorResponse(
        'Ha ocurrido un error.  Por favor, visite nuestra página de registro y vuelva a solicitar un email de confirmación.',
        400
      )
    );
  }

  // update confirmed to true
  user.confirmEmailToken = undefined;
  user.isEmailConfirmed = true;

  // save
  user.save({ validateBeforeSave: false });

  res.status(200).json({
    success: true,
  });
});

/*
  The following functions deal with the forgot password work flow
  The first one sends the email to start the process and the second uses the email link and allows the user to reset their password
*/

// send email for forgot password work flow
exports.forgotPasswordEmail = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({
    email: req.body.email,
    isEmailConfirmed: true,
  });

  if (user) {
    const resetToken = await user.getResetPasswordToken();
    await user.save();
    // create the reset password url
    const resetUrl = `${clientUrl}/reset_password/${resetToken}`;
    // generate reset password email
    const message = forgotTemplate(resetUrl, user);
    // send email
    await mailer.sendMail({
      from: emailFrom,
      to: req.body.email,
      subject: 'Recupera Contraseña de EnBlanco',
      html: message,
    });
  }

  res.status(200).json({
    success: true,
  });
});

// reset password with the reset token
exports.forgotPasswordReset = asyncHandler(async (req, res, next) => {
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.body.token)
    .digest('hex');

  const user = await User.findOne({
    resetPasswordToken,
    resetPasswordExpire: { $gt: Date.now() },
    isEmailConfirmed: true,
  });

  // user was not found
  if (!user) {
    return next(
      new ErrorResponse(
        'No se ha podido completar su pedido.  Por favor vuelva a solicitar otro email para recuperar su contraseña.',
        400
      )
    );
  }

  // remove reset date, reset token and append the new password
  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;

  // save the user in db with new password
  await user.save({ validateBeforeSave: true });

  res.status(200).json({
    success: true,
    message: 'Su contraseña ha sido actualizada',
  });
});

// allow a user to update there own profile
exports.updateMyProfile = asyncHandler(async (req, res, next) => {
  if (!req.body.email) {
    return next(new ErrorResponse('Email is requerido', 400));
  }

  let userWithEmail = false;
  let emailChanged = false;
  const user = req.user;

  // check if email has been altered
  if (user.email !== req.body.email) {
    userWithEmail = await User.findOne({
      $and: [
        {
          _id: {
            $ne: user._id,
          },
        },
      ],
      email: req.body.email,
    });

    if (userWithEmail) {
      return next(
        new ErrorResponse(
          `El email ${req.body.user.email} ya está en uso por otro usuario.  Por favor, escoja otro.`,
          400
        )
      );
    }

    user.email = req.body.email;
    user.isEmailConfirmed = false;
    emailChanged = true;
  }

  user.name = req.body.name || user.name;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  if (emailChanged) {
    // generate a confirmation token
    const confirmToken = await updatedUser.generateEmailConfirmToken();

    // generate a confirm url with the token and the email of the newly created user
    const confirmUrl = `${clientUrl}/confirm?token=${confirmToken}`;

    // generate the email template
    const message = confirmTemplate(confirmUrl);

    // save the user with the confirm data
    updatedUser.save({ validateBeforeSave: false });

    // send the email
    await mailer.sendMail({
      from: emailFrom,
      to: updatedUser.email,
      subject: 'Cofirmación de cuenta de En Blanco',
      html: message,
    });

    res.status(200).json({
      success: true,
    });
  } else {
    const jwt = updatedUser.getSignedJwtToken();

    console.log(updatedUser);

    res.status(200).json({
      success: true,
      userInfo: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        isAdmin: updatedUser.isAdmin,
        token: jwt,
      },
    });
  }
});

// get all available users
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  if (!users) {
    return next(new ErrorResponse('No hay usuarios en el sistema', 404));
  }

  res.status(200).json({
    success: true,
    users,
  });
});

// delete a user
exports.deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(
        `El usuario ${req.params.id} no fue encontrado en el sistema`,
        404
      )
    );
  }

  await user.remove();

  res.status(200).json({
    success: true,
  });
});

// admin updates a user
exports.updateUser = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(
      new ErrorResponse(
        `El usuario ${req.params.id} no fuen encontrado en el sistema`,
        404
      )
    );
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.isAdmin = req.body.isAdmin;
  user.isEmailConfirmed = req.body.isEmailConfirmed;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    userInfo: updatedUser,
  });
});
