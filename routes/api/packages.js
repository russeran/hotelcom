const express = require('express');
const router = express.Router();
const packagesCtrl = require('../../controllers/api/packages');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/index', packagesCtrl.index);
router.get('/:id', packagesCtrl.show);
router.post('/create', packagesCtrl.create);
router.put('/:id', packagesCtrl.update);
router.delete('/:id', packagesCtrl.delete);
router.post('/:id/notify', packagesCtrl.markNotified);
router.post('/:id/pickup', packagesCtrl.markPickedUp);

module.exports = router;
