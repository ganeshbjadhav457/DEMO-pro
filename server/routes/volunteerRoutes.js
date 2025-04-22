const express = require('express');
const { applyVolunteer, getVolunteers } = require('../controllers/volunteerController');
// Remove auth middleware import

const router = express.Router();

router.route('/')
  .post(applyVolunteer)
  .get(getVolunteers); // Remove admin middleware

module.exports = router;