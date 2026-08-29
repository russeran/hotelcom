const express = require('express');
const router = express.Router();
const lostAndFoundCtrl = require('../../controllers/api/lostAndFound');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/index', lostAndFoundCtrl.index);
router.get('/:id', lostAndFoundCtrl.show);
router.post('/create', lostAndFoundCtrl.create);
router.put('/:id', lostAndFoundCtrl.update);
router.delete('/:id', lostAndFoundCtrl.delete);
router.post('/:id/claim', lostAndFoundCtrl.claim);

module.exports = router;
