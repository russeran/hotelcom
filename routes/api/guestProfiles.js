const express = require('express');
const router = express.Router();
const guestProfilesCtrl = require('../../controllers/api/guestProfiles');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/index', guestProfilesCtrl.index);
router.get('/search', guestProfilesCtrl.search);
router.get('/:id', guestProfilesCtrl.show);
router.post('/create', guestProfilesCtrl.create);
router.put('/:id', guestProfilesCtrl.update);
router.delete('/:id', guestProfilesCtrl.delete);
router.post('/:id/notes', guestProfilesCtrl.addNote);

module.exports = router;
