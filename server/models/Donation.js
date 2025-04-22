// const mongoose = require('mongoose');

// const donationSchema = new mongoose.Schema({
//   donorName: {
//     type: String,
//     required: [true, 'Please add donor name']
//   },
//   email: {
//     type: String,
//     required: [true, 'Please add email'],
//     match: [
//       /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
//       'Please add a valid email'
//     ]
//   },
//   phone: {
//     type: String,
//     required: [true, 'Please add phone number']
//   },
//   amount: {
//     type: Number,
//     required: [true, 'Please add donation amount']
//   },
//   donationType: {
//     type: String,
//     enum: ['one-time', 'monthly'],
//     default: 'one-time'
//   },
//   paymentMethod: {
//     type: String,
//     enum: ['qr', 'app'],
//     required: true
//   },
//   upiId: {
//     type: String
//   },
//   receiptRequested: {
//     type: Boolean,
//     default: true
//   },
//   anonymous: {
//     type: Boolean,
//     default: false
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'initiated', 'completed', 'failed'],
//     default: 'pending'
//   },
//   transactionId: {
//     type: String
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Donation', donationSchema);


const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  donorName: {
    type: String,
    required: [true, 'Please add donor name']
  },
  email: {
    type: String,
    required: [true, 'Please add email'],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email'
    ]
  },
  phone: {
    type: String,
    required: [true, 'Please add phone number']
  },
  amount: {
    type: Number,
    required: [true, 'Please add donation amount']
  },
  donationType: {
    type: String,
    enum: ['one-time', 'monthly'],
    default: 'one-time'
  },
  paymentMethod: {
    type: String,
    enum: ['qr', 'upi', 'app'],
    required: true
  },
  upiId: {
    type: String
  },
  receiptRequested: {
    type: Boolean,
    default: true
  },
  anonymous: {
    type: Boolean,
    default: false
  },
  status: {
    type: String,
    enum: ['pending', 'initiated', 'completed', 'failed'],
    default: 'pending'
  },
  transactionId: {
    type: String
  },
  completedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;