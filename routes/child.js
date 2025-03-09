const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { addChild, getChildren } = require('../controllers/childController');

router.post('/', auth, addChild);
router.get('/', auth, getChildren);

module.exports = router;