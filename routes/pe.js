const express = require('express');
const router = express.Router();    
const { getPE } = require('../controllers/peController');

router.get('/get-pe', getPE);

module.exports = router;