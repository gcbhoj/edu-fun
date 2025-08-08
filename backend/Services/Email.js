const { text } = require("express");
const nodeMailer = require("nodemailer");

const sendEmail = async (emailData) => {
  // creating a transporter to send emails
  const transporter = nodeMailer.createTransport({
    host: process.env.TEST_EMAIL_HOST,
    port: process.env.TEST_EMAIL_PORT,
    auth: {
      user: process.env.TEST_EMAIL_ADDRESS,
      pass: process.env.TEST_EMAIL_PASSWORD,
    },
  });

  //Defining emailData
  const emailOptions = {
    from: '"OurApp Support" <support@ourApp.com>',
    to: emailData.email,
    subject: emailData.subject,
    text: emailData.message,
  };

  await transporter.sendMail(emailOptions);
};

module.exports = sendEmail;
