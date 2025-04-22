const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  });

  // Define email options
  const mailOptions = {
    from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
    to: options.email,
    subject: options.subject,
    html: options.message
  };

  // Send email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;






// const nodemailer = require('nodemailer');

// const transporter = nodemailer.createTransport({
//   service: process.env.EMAIL_SERVICE,
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASSWORD
//   }
// });

// exports.sendDonationReceipt = async (donation) => {
//   const mailOptions = {
//     from: process.env.EMAIL_FROM,
//     to: donation.email,
//     subject: 'PawsFeed Donation Receipt',
//     html: `
//       <h2>Thank You for Your Donation!</h2>
//       <p>We've received your donation of ₹${donation.amount}.</p>
//       <h3>Donation Details</h3>
//       <ul>
//         <li>Date: ${new Date(donation.createdAt).toLocaleString()}</li>
//         <li>Donation ID: ${donation._id}</li>
//         <li>Type: ${donation.donationType}</li>
//       </ul>
//       <p>Your support helps feed street dogs in Pune.</p>
//     `
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     console.log(`Receipt sent to ${donation.email}`);
//     return true;
//   } catch (error) {
//     console.error('Email sending failed:', error.message);
//     return false;
//   }
// };