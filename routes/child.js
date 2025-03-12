const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addChild, getChildren } = require('../controllers/childController');

router.post('/add-child', auth, addChild);
router.get('/get-children', auth, getChildren);

module.exports = router;