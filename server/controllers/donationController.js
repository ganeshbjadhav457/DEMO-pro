const Donation = require('../models/Donation');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');

// @desc    Create new donation
// @route   POST /api/donations
// @access  Public


const createDonation = asyncHandler(async (req, res) => {
  const {
    donorName,
    email,
    phone,
    amount,
    donationType,
    paymentMethod,
    upiId,
    receiptRequested,
    anonymous
  } = req.body;

  const donation = await Donation.create({
    donorName,
    email,
    phone,
    amount,
    donationType,
    paymentMethod,
    upiId,
    receiptRequested,
    anonymous,
    status: paymentMethod === 'qr' ? 'pending' : 'initiated'
  });

  if (receiptRequested) {
    const message = `
      <h2>Thank you for your donation to PawsFeed!</h2>
      <p>Your donation details:</p>
      <ul>
        <li>Amount: ₹${amount}</li>
        <li>Type: ${donationType === 'one-time' ? 'One-Time' : 'Monthly'} Donation</li>
        <li>Payment Method: ${paymentMethod === 'qr' ? 'QR Code' : 'UPI App'}</li>
        <li>Date: ${new Date().toLocaleDateString()}</li>
      </ul>
      <p>Your support helps us feed street dogs in Pune.</p>
      ${paymentMethod === 'qr' ? '<p>Please complete your payment by scanning the QR code on our website.</p>' : ''}
    `;

    try {
      await sendEmail({
        email: email,
        subject: 'Thank you for your donation to PawsFeed',
        message
      });
    } catch (error) {
      console.error('Failed to send receipt email:', error);
    }
  }

  res.status(201).json({
    success: true,
    data: donation,
    message: paymentMethod === 'qr' 
      ? 'Donation recorded successfully. Please complete payment by scanning the QR code.' 
      : 'Donation initiated. Redirecting to payment...'
  });
});

// @desc    Get all donations
// @route   GET /api/donations
// @access  Private/Admin
const getDonations = asyncHandler(async (req, res) => {
  const donations = await Donation.find().sort('-createdAt');
  res.status(200).json({
    success: true,
    count: donations.length,
    data: donations
  });
});

module.exports = {
  createDonation,
  getDonations
};

