const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const ctrl = require('../controllers/availabilityController');

router.post('/', auth, ctrl.createAvailability);
router.get('/:professorId', auth, ctrl.getAvailability);

module.exports = router;
