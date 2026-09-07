const express = require('express');
const router = express.Router();
const waitlistCtrl = require('../../controllers/api/waitlist');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/index', waitlistCtrl.index);
router.post('/create', waitlistCtrl.create);
router.put('/:id', waitlistCtrl.update);
router.delete('/:id', waitlistCtrl.delete);
router.post('/:id/notify', waitlistCtrl.notify);
router.post('/:id/convert', waitlistCtrl.convertToReservation);

module.exports = router;
