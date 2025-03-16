const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { submitFeedback, viewFeedbacks, viewPublicFeedbacks } = require('../controllers/feedbackController');

router.post('/submit-feedback', auth, submitFeedback);

router.get('/view-feedbacks', auth, viewFeedbacks); // Feedback cá nhân

router.get('/public-feedbacks', viewPublicFeedbacks); // Feedback công khai

module.exports = router;