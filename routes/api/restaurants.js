const express = require('express');
const router = express.Router();
const restaurantsCtrl = require('../../controllers/api/restaurants');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/index', restaurantsCtrl.index);
router.get('/:id', restaurantsCtrl.show);
router.post('/create', restaurantsCtrl.create);
router.put('/:id', restaurantsCtrl.update);
router.delete('/:id', restaurantsCtrl.delete);
router.post('/:id/tables', restaurantsCtrl.addTable);
router.delete('/:id/tables/:tableId', restaurantsCtrl.removeTable);
router.post('/:id/generate-qr-codes', restaurantsCtrl.generateQRCodes);
router.post('/:id/generate-menu-qr', restaurantsCtrl.generateMenuQR);

module.exports = router;
