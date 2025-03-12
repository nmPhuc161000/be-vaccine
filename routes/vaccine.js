const express = require('express');
const router = express.Router();
const { getVaccines } = require('../controllers/vaccineController');

router.get('/get-vaccines', getVaccines);

module.exports = router;