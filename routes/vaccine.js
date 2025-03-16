const express = require('express');
const router = express.Router();
const { auth, checkRole } = require('../middleware/auth'); // Import đúng cách
const { getVaccines, getVaccineById, addVaccine, updateVaccine, deleteVaccine } = require('../controllers/vaccineController');

router.get('/get-vaccines', getVaccines);
router.get('/get-vaccine/:id', getVaccineById);
router.post('/add-vaccine', [auth, checkRole(['admin', 'staff'])], addVaccine);
router.put('/update-vaccine/:id', [auth, checkRole(['admin', 'staff'])], updateVaccine);
router.delete('/delete-vaccine/:id', [auth, checkRole(['admin', 'staff'])], deleteVaccine);

module.exports = router;