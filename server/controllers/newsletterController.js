const Newsletter = require('../models/Newsletter');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');

// @desc    Subscribe to newsletter
// @route   POST /api/newsletter
// @access  Public
const subscribeNewsletter = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Check if already subscribed
  const existingSubscriber = await Newsletter.findOne({ email });
  if (existingSubscriber) {
    res.status(400);
    throw new Error('This email is already subscribed to our newsletter');
  }

  const subscriber = await Newsletter.create({ email });

  // Send welcome email
  const message = `
    <h2>Welcome to PawsFeed Newsletter!</h2>
    <p>Thank you for subscribing to our newsletter. You'll now receive updates about our work with street dogs in Pune.</p>
    <p>Here's what you can expect:</p>
    <ul>
      <li>Monthly updates on our feeding programs</li>
      <li>Success stories of dogs we've helped</li>
      <li>Upcoming volunteer opportunities</li>
      <li>Special donation campaigns</li>
    </ul>
    <p>If you ever wish to unsubscribe, just reply to any of our emails with "Unsubscribe".</p>
  `;

  try {
    await sendEmail({
      email: email,
      subject: 'Welcome to PawsFeed Newsletter',
      message
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
  }

  res.status(201).json({
    success: true,
    data: subscriber,
    message: 'Subscribed to newsletter successfully'
  });
});

module.exports = {
  subscribeNewsletter
};