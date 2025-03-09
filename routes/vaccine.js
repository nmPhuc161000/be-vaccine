const express = require('express');
const router = express.Router();
const { getVaccines } = require('../controllers/vaccineController');

router.get('/', getVaccines);

module.exports = router;