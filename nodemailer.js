const nodemailer = require('nodemailer');
const config = require('./config');

let testEmailAccount = nodemailer.createTestAccount();

exports.transporter = nodemailer.createTransport({
    service: 'mail.ru',
    auth: {
        user: config.config.email.emailFrom,
        pass: config.config.email.emailPass
    },
})
