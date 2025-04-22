const express = require('express');
const { subscribeNewsletter } = require('../controllers/newsletterController');

const router = express.Router();

router.route('/').post(subscribeNewsletter);

module.exports = router;