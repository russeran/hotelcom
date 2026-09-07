const express = require('express');
const router = express.Router();
const userPreferencesCtrl = require('../../controllers/api/userPreferences');
const ensureLoggedIn = require('../../config/ensureLoggedIn');

router.use(ensureLoggedIn);

router.get('/', userPreferencesCtrl.getPreferences);
router.put('/', userPreferencesCtrl.updatePreferences);
router.post('/reset-dashboard', userPreferencesCtrl.resetDashboard);

module.exports = router;
