const express = require('express');
const { createDonation, getDonations } = require('../controllers/donationController');
// Remove auth middleware imports

const router = express.Router();

router.route('/')
  .post(createDonation)
  .get(getDonations); // Removed admin protection

module.exports = router;