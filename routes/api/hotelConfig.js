const express = require('express');
const router = express.Router();
const hotelConfigCtrl = require('../../controllers/api/hotelConfig');
const ensureLoggedIn = require('../../config/ensureLoggedIn');
const requireRole = require('../../config/requireRole');

// All routes require manager or admin role
router.use(ensureLoggedIn);
router.use(requireRole('manager', 'admin'));

// Get current configuration
router.get('/', hotelConfigCtrl.getConfig);

// Update entire configuration
router.put('/', hotelConfigCtrl.updateConfig);

// Update specific section
router.put('/section/:section', hotelConfigCtrl.updateSection);

// Knowledge base management
router.post('/knowledge/:type', hotelConfigCtrl.addKnowledgeItem);
router.put('/knowledge/:type/:index', hotelConfigCtrl.updateKnowledgeItem);
router.delete('/knowledge/:type/:index', hotelConfigCtrl.deleteKnowledgeItem);

// Training suggestions
router.get('/training-suggestions', hotelConfigCtrl.getTrainingSuggestions);

// Reset to defaults (admin only)
router.post('/reset', requireRole('admin'), hotelConfigCtrl.resetConfig);

module.exports = router;
