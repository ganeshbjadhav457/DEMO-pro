const express = require('express');
const donationRoutes = require('./donationRoutes.js');
const volunteerRoutes = require('./volunteerRoutes.js');
const newsletterRoutes = require('./newsletterRoutes.js');

const router = express.Router();

router.use('/donations', donationRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/newsletter', newsletterRoutes);

module.exports = router;