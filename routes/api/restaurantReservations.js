const express = require('express');
const router = express.Router();
const restaurantReservationsCtrl = require('../../controllers/api/restaurantReservations');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/index', restaurantReservationsCtrl.index);
router.get('/check-availability', restaurantReservationsCtrl.checkAvailability);
router.get('/:id', restaurantReservationsCtrl.show);
router.post('/create', restaurantReservationsCtrl.create);
router.put('/:id', restaurantReservationsCtrl.update);
router.delete('/:id', restaurantReservationsCtrl.delete);
router.post('/:id/status', restaurantReservationsCtrl.updateStatus);

module.exports = router;
