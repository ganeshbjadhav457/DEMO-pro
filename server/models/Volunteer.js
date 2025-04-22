const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add name']
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  location: {
    type: String,
    required: [true, 'Please add location']
  },
  availability: {
    type: [String],
    required: [true, 'Please select availability']
  },
  experience: {
    type: String
  },
  motivation: {
    type: String,
    required: [true, 'Please add motivation']
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Volunteer', volunteerSchema);