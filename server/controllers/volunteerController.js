const Volunteer = require('../models/Volunteer');
const asyncHandler = require('express-async-handler');
const sendEmail = require('../utils/sendEmail');

// @desc    Apply as volunteer
// @route   POST /api/volunteers
// @access  Public
const applyVolunteer = asyncHandler(async (req, res) => {
  const { name, email, phone, location, availability, experience, motivation } = req.body;

  // Check if already applied
  const existingApplication = await Volunteer.findOne({ email });
  if (existingApplication) {
    res.status(400);
    throw new Error('You have already submitted a volunteer application');
  }

  const volunteer = await Volunteer.create({
    name,
    email,
    phone,
    location,
    availability,
    experience,
    motivation
  });

  // Send confirmation email to volunteer
  const volunteerMessage = `
    <h2>Thank you for applying to volunteer with PawsFeed!</h2>
    <p>We have received your application and will review it shortly.</p>
    <p>Here are the details you provided:</p>
    <ul>
      <li>Name: ${name}</li>
      <li>Preferred Location: ${location}</li>
      <li>Availability: ${availability.join(', ')}</li>
    </ul>
    <p>We'll contact you at ${email} or ${phone} once your application is processed.</p>
  `;

  // Send notification to admin
  const adminMessage = `
    <h2>New Volunteer Application</h2>
    <p>A new volunteer application has been submitted:</p>
    <ul>
      <li>Name: ${name}</li>
      <li>Email: ${email}</li>
      <li>Phone: ${phone}</li>
      <li>Location: ${location}</li>
      <li>Availability: ${availability.join(', ')}</li>
      <li>Experience: ${experience || 'None provided'}</li>
    </ul>
    <p>Motivation: ${motivation}</p>
  `;

  try {
    await sendEmail({
      email: email,
      subject: 'PawsFeed Volunteer Application Received',
      message: volunteerMessage
    });

    await sendEmail({
      email: process.env.FROM_EMAIL,
      subject: 'New Volunteer Application - PawsFeed',
      message: adminMessage
    });
  } catch (error) {
    console.error('Failed to send emails:', error);
  }

  res.status(201).json({
    success: true,
    data: volunteer,
    message: 'Volunteer application submitted successfully'
  });
});

// @desc    Get all volunteer applications
// @route   GET /api/volunteers
// @access  Private/Admin
const getVolunteers = asyncHandler(async (req, res) => {
  const volunteers = await Volunteer.find().sort('-createdAt');
  res.status(200).json({
    success: true,
    count: volunteers.length,
    data: volunteers
  });
});

module.exports = {
  applyVolunteer,
  getVolunteers
};