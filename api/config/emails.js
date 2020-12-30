const nodemailer = require('nodemailer');
const nodemailerSendgrid = require('nodemailer-sendgrid');
const { sgApiKey } = require('./keys');

// create email object and export it
const mailer = nodemailer.createTransport(
  nodemailerSendgrid({
    apiKey: sgApiKey,
  })
);

module.exports = mailer;
